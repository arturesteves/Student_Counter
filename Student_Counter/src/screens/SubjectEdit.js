import Subject from '../lib/Subject';
import Student from '../lib/Student';
import React from 'react';
import { View, Text, Button, TextInput, ScrollView, Dimensions } from "react-native";
import MultiEntityPicker from "../components/MultiEntityPicker";
import Header from "../components/Header";
import Spinner from 'react-native-loading-spinner-overlay';
import Teacher from "../lib/Teacher.js";

export default class SubjectEdit extends React.Component {

    constructor(props){
        super(props);
        this.state = { overseers: {}, name:"",acronym:"", isLoading:false};
    }

    async componentDidMount() {

        let subject = this.props.navigation.state.params.subject;
        let items = {} ;
        console.log(subject.overseersIds);
        for(let item of subject.overseersIds) {

            let teacher = await Teacher.retrieve(item);
            items[teacher.id] = {
                title: teacher.name,
                identifier: teacher.id
            };

            this.state.teacherPicker = <MultiEntityPicker initial={items} entity="teacher"
                                                          onAdd={(identifier)=>{
                                                              console.log("Added",identifier)
                                                              this.state.overseers[identifier] = identifier;
                                                              this.setState(this.state);
                                                          }}
                                                          onRemove={(identifier)=>{
                                                              console.log("Removed",identifier)
                                                              delete this.state.overseers[identifier];
                                                              this.setState(this.state);
                                                          }}
            />
        }

        this.state.name = subject.name;
        this.state.acronym = subject.acronym;
        for(let id of subject.overseersIds) {
            this.state.overseers[id] = id;
        }

        this.setState(this.state);

    }
    static navigationOptions = {
        drawerLabel: undefined,
    };
    ///////

    update(){
        console.log(this.state);
        if(this.state.name.length  < 1){
            alert("You need to add a name");
            return null;
        }
        if(this.state.acronym.length  < 1){
            alert("You need to add a acronym");
            return null;
        }
        if(Object.keys(this.state.overseers).length === 0){
            alert("You need to add a teacher!");
            return null;
        }

        let subject = this.props.navigation.state.params.subject;
        subject.name = this.state.name;
        subject.acronym = this.state.acronym;
        subject.overseersIds = Object.keys(this.state.overseers);
        subject.save().then(()=> {
            this.props.navigation.navigate('Subject');
            this.setState({
                isLoading:!this.state.isLoading
            })
        });


    }

    render(){
        const { navigate } = this.props.navigation;
        return(
            <View>
                <Spinner visible={this.state.isLoading} textContent={"Talking to the Database"} textStyle={{color: '#FFF'}} />
                <Header navigate={navigate} text="Edit Subject"/>
                <ScrollView height={Dimensions.get("window").height-90} showsVerticalScrollIndicator={false}>
                    <Text>Insert the name of the subject</Text>
                    <TextInput
                        onChangeText={(name) => {
                            this.state.name = name;
                            this.setState(this.state);
                        }}
                        value={this.state.name}
                    />
                    <Text>Insert the acronym of the subject</Text>
                    <TextInput
                        onChangeText={(acronym) => {
                            this.state.acronym = acronym;
                            this.setState(this.state);
                        }}
                        value={this.state.acronym}
                    />
                    <Text>Teacher</Text>
                    {this.state.teacherPicker}

                    <Button onPress={this.update.bind(this)} title="Update" />
                </ScrollView>
            </View>
        )
    }
}

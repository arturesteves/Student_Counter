import Class from '../lib/Class';
import Student from '../lib/Student';
import Subject from '../lib/Subject';
import React from 'react';
import { BackHandler, View, Text, Button, TextInput, ScrollView, Dimensions } from "react-native";
import MultiEntityPicker from "../components/MultiEntityPicker";
import Header from "../components/Header";
import Spinner from 'react-native-loading-spinner-overlay';

export default class ClassEdit extends React.Component {

    constructor(props){
        super(props);
        this.state = { students: {}, subjects: {}, name:"", isLoading:false };
    }

    componentWillMount(){
        BackHandler.addEventListener('hardwareBackPress',()=>{
            this.props.navigation.navigate("Class");
            return true;
        });
    }

    static navigationOptions = {
        drawerLabel: undefined,
    };

    async componentDidMount() {

        let clazz = this.props.navigation.state.params.clazz;
        let items = {} ;
        console.log(clazz.studentIds);
        for(let item of clazz.studentIds) {

            let student = await Student.retrieve(item);
            items[student.id] = {
                title: student.name,
                identifier: student.id
            };

            this.state.studentPicker = <MultiEntityPicker initial={items} entity="student"
                                   onAdd={(identifier)=>{
                                       console.log("Added",identifier)
                                       this.state.students[identifier] = identifier;
                                       this.setState(this.state);
                                   }}
                                   onRemove={(identifier)=>{
                                       console.log("Removed",identifier)
                                       delete this.state.students[identifier];
                                       this.setState(this.state);
                                   }}
                />

        }

        items = {} ;
        console.log(clazz.subjectIds);
        for(let item of clazz.subjectIds) {

            let subject = await Subject.retrieve(item);
            items[subject.id] = {
                title: subject.name,
                identifier: subject.id
            };

            this.state.subjectPicker = <MultiEntityPicker initial={items} entity="subject"
                                                          onAdd={(identifier)=>{
                                                              console.log("Added",identifier)
                                                              this.state.subjects[identifier] = identifier;
                                                              this.setState(this.state);
                                                          }}
                                                          onRemove={(identifier)=>{
                                                              console.log("Removed",identifier)
                                                              delete this.state.subjects[identifier];
                                                              this.setState(this.state);
                                                          }}
            />

        }

        this.state.name = clazz.name;

        for(let id of clazz.studentIds) {
            this.state.students[id] = id;
        }

        for(let id of clazz.subjectIds) {
            this.state.subjects[id] = id;
        }

        this.setState(this.state);

    }

    update(){
        if(this.state.name.length <1 ){
            alert("Please insert the class name");
            return null;
        }
        if(Object.keys(this.state.students).length === 0){
            alert("Please insert students");
            return null;
        }
        if(Object.keys(this.state.subjects).length === 0){
            alert("Please insert subjects");
            return null;
        }
        this.setState({
                isLoading:!this.state.isLoading
            });
        let clazz = this.props.navigation.state.params.clazz;
        clazz.name = this.state.name;
        clazz.studentIds = Object.keys(this.state.students);
        clazz.subjectIds = Object.keys(this.state.subjects);
        clazz.save().then(()=> {
            this.setState({
                isLoading:!this.state.isLoading
            });
            this.props.navigation.navigate('Class');
        });
    }

    render(){
        const { navigate } = this.props.navigation;
        return(
            <View>
                <Spinner visible={this.state.isLoading} textContent={"Talking to the Database"} textStyle={{color: '#FFF'}} />
                <Header navigate={navigate} text="Edit Class"/>
                <ScrollView height={Dimensions.get("window").height-90} showsVerticalScrollIndicator={false}>
                    <Text>Insert the name of the class</Text>
                    <TextInput
                        onChangeText={(name) => {
                            this.state.name = name;
                            this.setState(this.state);
                        }}
                        value={this.state.name}
                    />
                    <Text>Students</Text>
                    {this.state.studentPicker}
                    <Text>Subjects</Text>
                    {this.state.subjectPicker}

                    <Button onPress={this.update.bind(this)} title="Update" />
                </ScrollView>
            </View>
        )
    }
}

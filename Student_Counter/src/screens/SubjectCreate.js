import Subject from '../lib/Subject';
import Student from '../lib/Student';
import React from 'react';
import { View, Text, Button, TextInput, ScrollView, Dimensions } from "react-native";
import MultiEntityPicker from "../components/MultiEntityPicker";
import Header from "../components/Header";

export default class SubjectCreate extends React.Component {

    constructor(props){
        super(props);
        this.state = { overseers: {} };
    }

    static navigationOptions = {
        drawerLabel: undefined,
    };

    ////////
    create(){

        let subject = new Subject(this.state.name, this.state.acronym, Object.keys(this.state.overseers));
        subject.save().then(()=> {
            this.props.navigation.navigate('Subject');
        });
    }

    render(){
        const { navigate } = this.props.navigation;
        return(
            <View>
                <Header navigate={navigate} text="Create Class"/>
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
                    <MultiEntityPicker entity="teacher"
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

                    <Button onPress={this.create.bind(this)} title="Create" />
                </ScrollView>
            </View>
        )
    }
}

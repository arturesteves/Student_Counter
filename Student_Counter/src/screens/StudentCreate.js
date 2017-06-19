import Student from '../lib/Student';
import React from 'react';
import { BackHandler, View, Text,  TextInput, Dimensions } from "react-native";
import Header from "../components/Header";
import {FormLabel, FormInput, Button, FormValidationMessage} from 'react-native-elements'

export default class StudentCreate extends React.Component {

    constructor(props){
        super(props);
        this.state = {number: null, name: null,  email: null};
    }

    componentWillMount(){
        BackHandler.addEventListener('hardwareBackPress',()=>{
            this.props.navigation.navigate("Student");
            return true;
        });
    }

    static navigationOptions = {
        drawerLabel: undefined,
    };

    /////
    create(){

        if(!this.state.number){
            alert("The number field is required");
            return;
        }

        if(!this.state.name){
            alert("The name field is required");
            return;
        }

        if(!this.state.email){
            alert("The email field is required");
            return;
        }

        let student = new Student (this.state.number, this.state.name, this.state.email);
        student.save().then(()=> {
            this.props.navigation.navigate('Student');
        });
    }

    render(){
        const { navigate } = this.props.navigation;
        let that = this;
        let xml = <Header navigate={navigate} text="Create Student"/>;
        return(
            <View style={{height: Dimensions.get("window").height - 25}}>
                {xml}
                <FormLabel>Number</FormLabel>
                <FormInput textInputRef="" placeholder="Please enter the student number" onChangeText={(number) => {
                    this.state.number = number;
                    this.setState(this.state);
                }}/>

                {/*<FormValidationMessage>Error message</FormValidationMessage>*/}
                <FormLabel>Name</FormLabel>
                <FormInput textInputRef="number" placeholder="Please enter the student name" onChangeText={(name) => {
                    this.state.name = name;
                    this.setState(this.state);
                }}/>
                {/*<FormValidationMessage>Error message</FormValidationMessage>*/}
                <FormLabel>Email</FormLabel>
                <FormInput textInputRef="number" placeholder="Please enter the student email" onChangeText={(email) => {
                    this.state.email = email;
                    this.setState(this.state);
                }}/>
                {/*<FormValidationMessage>Error message</FormValidationMessage>*/}
                <View style={{left: 5, right: 5}}>
                    <Button buttonStyle={{backgroundColor: "black"}} onPress={this.create.bind(this)} title="Create"/>
                </View>
            </View>
        )
    }
}

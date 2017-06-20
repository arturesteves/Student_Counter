import Student from '../lib/Student';
import React from 'react';
import { BackHandler, View, Dimensions, Text,  TextInput } from "react-native";
import Header from "../components/Header";
import {FormLabel, FormInput, Button, FormValidationMessage} from 'react-native-elements'
export default class StudentEdit extends React.Component {

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


    componentDidMount() {
        let student = this.props.navigation.state.params.student;
        this.state.number = student.number;
        this.state.name = student.name;
        this.state.email = student.email;
        this.setState(this.state);
    }

    /////////////
    //////
    update(){

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

        let student = this.props.navigation.state.params.student;
        student.number = this.state.number;
        student.name = this.state.name;
        student.email = this.state.email;
        student.save().then(()=> {
            this.props.navigation.navigate('Student');
        });
    }

    render(){
        const { navigate } = this.props.navigation;
        let xml = <Header navigate={navigate} text="Edit Student"/>;
        return(
            <View style={{height: Dimensions.get("window").height - 25}}>
                {xml}
                {/*<FormValidationMessage>Error message</FormValidationMessage>*/}
                <FormLabel>Name</FormLabel>
                <FormInput textInputRef="number" placeholder="Please enter the student name" onChangeText={(name) => {
                    this.state.name = name;
                    this.setState(this.state);
                }} value={this.state.name}/>
                {/*<FormValidationMessage>Error message</FormValidationMessage>*/}
                <FormLabel>Email</FormLabel>
                <FormInput textInputRef="number" placeholder="Please enter the student email" onChangeText={(email) => {
                    this.state.email = email;
                    this.setState(this.state);
                }} value={this.state.email}/>
                {/*<FormValidationMessage>Error message</FormValidationMessage>*/}
                <View style={{left: 5, right: 5}}>
                    <Button buttonStyle={{backgroundColor: "black"}} onPress={this.update.bind(this)} title="Update"/>
                </View>
            </View>
        )
    }
}

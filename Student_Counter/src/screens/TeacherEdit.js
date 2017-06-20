import Teacher from '../lib/Teacher';
import React from 'react';
import { BackHandler, View, Text, TextInput } from "react-native";
import Header from "../components/Header";
import {FormLabel, FormInput, Button, FormValidationMessage} from 'react-native-elements'

export default class TeacherEdit extends React.Component {

    constructor(props){
        super(props);
        this.state = {};
    }

    componentWillMount(){
        BackHandler.addEventListener('hardwareBackPress',()=>{
            this.props.navigation.navigate("Teacher");
            return true;
        });

        let teacher = this.props.navigation.state.params.teacher;
        this.state.name = teacher.name;
        this.state.email = teacher.email;
        this.state.password = teacher.password;

    }

    static navigationOptions = {
        drawerLabel: undefined,
    };

    /////
    /*create(){

        let teacher = new Teacher (this.state.name, this.state.email);
        teacher.save().then(()=> {
            this.props.navigation.navigate('Teacher');
        });
    }*/

    render(){
        const { navigate } = this.props.navigation;
        let that = this;
        return(
            <View>
                <Header navigate={navigate} text="Create Teacher"/>
                <FormLabel>Insert the name of the teacher</FormLabel>
                <FormInput textInputRef="number" placeholder="Please enter the teacher name" onChangeText={(name) => {
                    this.state.name = name;
                    this.setState(this.state);
                }} value={this.state.name}/>

                <FormLabel>Insert the email of the teacher</FormLabel>
                <FormInput textInputRef="number" placeholder="Please enter the teacher email" onChangeText={(name) => {
                    this.state.email = email;
                    this.setState(this.state);
                }} value={this.state.email}/>

                <View style={{left: 5, right: 5}}>
                    <Button buttonStyle={{backgroundColor: "black"}} onPress={this.update.bind(this)} title="Update"/>
                </View>
            </View>
        )
    }
}

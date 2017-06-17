import Student from '../lib/Student';
import React from 'react';
import { View, Text, Button, TextInput } from "react-native";
import Header from "../components/Header";

export default class StudentEdit extends React.Component {

    constructor(props){
        super(props);
        this.state = {number: null, name: null,  email: null};
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
        return(
            <View>
                <Header navigate={navigate} text="Edit Student"/>
                <Text>Insert the number of the student</Text>
                <TextInput
                    placeholder="number"
                    onChangeText={(number) => {
                        this.state.number = number;
                        this.setState(this.state);
                    }}
                    value={this.state.number}
                />
                <Text>Insert the name of the student</Text>
                <TextInput
                    placeholder="name"
                    onChangeText={(name) => {
                        this.state.name = name;
                        this.setState(this.state);
                    }}
                    value={this.state.name}
                />
                <Text>Insert the email of the student</Text>
                <TextInput
                    placeholder="email"
                    onChangeText={(email) => {
                        this.state.email = email;
                        this.setState(this.email);
                    }}
                    value={this.state.email}
                />

                <Button onPress={()=>this.update()} title="Update" />
            </View>
        )
    }
}

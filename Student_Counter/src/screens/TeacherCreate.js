import Teacher from '../lib/Teacher';
import React from 'react';
import { View, Text, Button, TextInput } from "react-native";
import Header from "../components/Header";

export default class TeacherCreate extends React.Component {

    constructor(props){
        super(props);
        this.state = {};
    }

    static navigationOptions = {
        drawerLabel: undefined,
    };

    /////
    create(){

        //todo - validation of the values

        let teacher = new Teacher (this.state.name, this.state.email);
        teacher.save().then(()=> {
            this.props.navigation.navigate('Teacher');
        });
    }

    render(){
        const { navigate } = this.props.navigation;
        let that = this;
        return(
            <View>
                <Header navigate={navigate} text="Create Teacher"/>
                <Text>Insert the name of the teacher</Text>
                <TextInput
                    placeholder="name"
                    onChangeText={(name) => {
                        this.state.name = name;
                        this.setState(this.state);
                    }}
                    value={this.state.name}
                />
                <Text>Insert the email of the teacher</Text>
                <TextInput
                    placeholder="email"
                    onChangeText={(email) => {
                        this.state.email = email;
                        this.setState(this.email);
                    }}
                    value={this.state.email}
                />

                <Button onPress={this.create.bind(this)} title="Create" />
            </View>
        )
    }
}

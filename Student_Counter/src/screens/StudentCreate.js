import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button,
    Dimensions,
    Image,
    TouchableHighlight,
} from "react-native";
import { DrawerNavigator } from "react-navigation";
import Header from "../components/Header"


export default class StudentCreate extends React.Component {
    static navigationOptions = {
        drawerLabel: "Create Student",
    }
    // static async getTeachers(){
    //     let teachers = await TeacherClass.all()
    //     return teachers.map((t)=> t.id);
    // }
    //
    // teacherPicker(){
    //     return <Picker>
    //             {this.getTeachers().map((t)=> <Picker.Item label={t.name} value={t.id} /> )}
    //         </Picker>
    // }
    render(){
        const { navigate } = this.props.navigator;
        return(
            <View>
                <Header navigate={navigate}/>
                <Text>Student create Screen</Text>
            </View>
        )
    }
}

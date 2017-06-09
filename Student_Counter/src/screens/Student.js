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


export default class Student extends React.Component {
    static navigationOptions = {
        drawerLabel: "Student",
    }
    render(){
        const { navigate } = this.props.navigation;
        return(
            <View>
                <Header navigate={navigate}/>
                <Text>Student Screen</Text>
            </View>
        )
    }
}
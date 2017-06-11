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
    };

    render(){
        return(
            <View>
                <Header navigate={this.props.navigation}/>
                <Text>Student Screen</Text>
                <Button onPress={() => this.props.navigation('StudentCreate')} title="Create new student" />
            </View>
        )
    }
}

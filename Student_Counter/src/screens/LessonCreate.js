/**
 * Created by Ricardo Morais on 10/06/2017.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button,
    Dimensions,
    Image,
    TouchableHighlight,
    ScrollView,
    TextInput
} from "react-native";
import { DrawerNavigator } from "react-navigation";
import Header from "../components/Header"
import Styles from "../styles/Styles.js";
import TeacherClass from "../lib/Teacher.js";


export default class LessonCreate extends React.Component {
    static navigationOptions = {
        drawerLabel: undefined,
    }
    constructor(){
        super();
        this.state = {

        }
    }
    componentDidMount(){
        this.getLessonItems();
    }



    render(){
        const { navigate } = this.props.navigation;
        return(
            <View>

            </View>
        )
    }
}

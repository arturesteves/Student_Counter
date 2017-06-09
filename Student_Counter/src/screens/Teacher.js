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
import Styles from "../styles/Styles.js";


export default class Teacher extends React.Component {
    static navigationOptions = {
        drawerLabel: "Teacher",
    }
    render(){
        const { navigate } = this.props.navigation;
        return(
            <View>
                <Header navigate={navigate} text="Teacher"/>
                <View style={Styles.teacherContent}>
                    <Image source={require("../icons/userPic.jpg")} style={Styles.teacherImage}/>
                    <View style={Styles.teacherInfo}>
                        <Text style={Styles.teacherInfoText}>John Doe</Text>
                        <Text style={Styles.teacherInfoText}>21</Text>
                    </View>
                </View>
            </View>
        )
    }
}
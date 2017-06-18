import React, {Component} from "react";
import {BackHandler, View, Text, Image, TouchableHighlight} from "react-native";
import Styles from "../styles/Styles.js";
import Icons from "../icons/icons.js";
let SharedPreferences = require('react-native-shared-preferences');


export default class DrawerTab extends React.Component{
    constructor(props){
        super(props);
    }

    logout (){
        SharedPreferences.clear();  //more drastic
        SharedPreferences.setItem("id", "");
        SharedPreferences.setItem("email", "");

        this.props.navigator("Registration");
        return true;
    }

    render(){
        return(
            <TouchableHighlight underlayColor={"white"} onPress={() => this.props.navigate ? this.props.navigate(this.props.text) : this.logout()}>
                <View  style={Styles.drawerTab}>
                <Image source={Icons[this.props.icon]} style={Styles.drawerTabIcon}/>
                <Text style={Styles.drawerTabText}>{this.props.text}</Text>
                </View>
            </TouchableHighlight>
        )
    }
}
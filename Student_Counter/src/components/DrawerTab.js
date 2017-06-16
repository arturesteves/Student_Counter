import React, {Component} from "react";
import {View, Text, Image, TouchableHighlight} from "react-native";
import Styles from "../styles/Styles.js";
import Icons from "../icons/icons.js";

export default class DrawerTab extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <TouchableHighlight underlayColor={"white"} onPress={() => this.props.navigate(this.props.text)}>
                <View  style={Styles.drawerTab}>
                <Image source={Icons[this.props.icon]} style={Styles.drawerTabIcon}/>
                <Text style={Styles.drawerTabText}>{this.props.text}</Text>
                </View>
            </TouchableHighlight>
        )
    }
}
import React, {Component} from "react";
import {View, Text, TouchableHighlight, Image} from "react-native";
import Styles from "../styles/Styles.js";

export default class Header extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <View style = {Styles.homeHeader}>
            <TouchableHighlight hitSlop={{top: 10, bottom: 10, left: 10, right: 10}} underlayColor={"white"} onPress = {() =>this.props.navigate("DrawerOpen")}>
                <Image
                    style={Styles.hamburger}
                    source={require("../icons/hamburger.png")} />
            </TouchableHighlight>
            <Text style = {Styles.headerTitle}>{this.props.text}</Text>
            <Image
                    style={[Styles.hamburger, Styles.hidden]}
                    source={require("../icons/hamburger.png")} />
            </View>
        )
    }
}
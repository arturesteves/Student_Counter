import React, {Component} from "react";
import {View, Text, Image, TouchableHighlight} from "react-native";
import Styles from "../styles/Styles.js";
import Icons from "../icons/icons.js";

export default class DrawerHeader extends React.Component{
    render(){
        return(
            <View style={Styles.drawerHeader}>
                <View style={Styles.drawerIcon}>
                    <TouchableHighlight hitSlop={{top: 10, bottom: 10, left: 10, right: 10}} underlayColor={"white"} onPress={() => this.props.navigate("DrawerClose")}>
                    <Image source={Icons["closeMenu"]} style={Styles.hamburger} />
                    </TouchableHighlight>
                </View>
                <View style={Styles.drawerUserInfo}>
                    <Image source={Icons.userPic} style={Styles.userInfoPic} />
                    <View style = {Styles.userAbout}>
                        <Text style={Styles.userAboutName}>John Doe</Text>
                        <Text style={Styles.userAboutOccupation}>Professor</Text>
                    </View>
                </View>
            </View>
        )
    }
}
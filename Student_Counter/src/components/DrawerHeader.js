import React, {Component} from "react";
import {View, Text, Image, TouchableHighlight} from "react-native";
import Styles from "../styles/Styles.js";
import Icons from "../icons/icons.js";
let SharedPreferences = require('react-native-shared-preferences');
import TeacherLib from '../lib/Teacher';

export default class DrawerHeader extends React.Component{
    constructor(props){
        super(props);
        this.state={
            teacher: {
                name: "John Doe"
            }
        }
    }

    componentDidMount(){
        let that = this;
        SharedPreferences.getItem("id", function(value){
            if(value){
                that.setState( {isLoading: true});
                //retrieve teacher
                TeacherLib.retrieve(value).then(function(teacher){
                    that.setState( {isLoading: false});
                    that.setState( {teacher: teacher});

                }).catch(function(error){
                    that.setState( {isLoading: false});
                    alert("error");
                    console.log("error: ", error.message);
                })
            }else{
                alert("Nao estou logado!");
            }
        })
    }

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
                        <Text style={Styles.userAboutName}>{this.state.teacher.name}</Text>
                        <Text style={Styles.userAboutOccupation}>Professor</Text>
                    </View>
                </View>
            </View>
        )
    }
}
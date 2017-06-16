import React, {Component} from "react";
import {View} from "react-native";
import DrawerTab from "./DrawerTab";
import Styles from "../styles/Styles.js";

export default class DrawerContent extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <View style={Styles.drawerContent}>
                <DrawerTab text="Home" icon="home" navigate={this.props.navigate}/>
                <DrawerTab text="Lesson" icon="lesson" navigate={this.props.navigate}/>
                <DrawerTab text="Subject" icon="subject" navigate={this.props.navigate}/>
                <DrawerTab text="Teacher" icon="teacher" navigate={this.props.navigate}/>
                <DrawerTab text="Student" icon="student" navigate={this.props.navigate}/>
                <DrawerTab text="Class" icon="class" navigate={this.props.navigate}/>
                <DrawerTab text="Metrics" icon="lesson" navigate={this.props.navigate}/>
            </View>
        )
    }
}
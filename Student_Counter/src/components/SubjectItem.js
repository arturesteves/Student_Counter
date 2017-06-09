import React, {Component} from "react";
import {View, Text, Image, TouchableHighlight} from "react-native";
import Styles from "../styles/Styles.js";
import Icons from "../icons/icons.js";

export default class SubjectItem extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <TouchableHighlight underlayColor={"white"} onPress={() => alert("Subject")}>
                <View style={[Styles.subjectItem, {backgroundColor:this.props.color}]}>
                    <Text style={Styles.subjectItemText}>{this.props.name}</Text>
                    <TouchableHighlight underlayColor={this.props.color} onPress={() => alert("Delete")}>
                    <Image source={Icons.garbage} style={Styles.lessonItemDelete} />
                    </TouchableHighlight>
                </View>
            </TouchableHighlight>
        )
    }
}
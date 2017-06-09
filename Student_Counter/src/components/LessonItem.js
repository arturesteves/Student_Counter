import React, {Component} from "react";
import {View, Text, Image, TouchableHighlight} from "react-native";
import Styles from "../styles/Styles.js";
import Icons from "../icons/icons.js";

export default class LessonItem extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <TouchableHighlight underlayColor={"white"} onPress={() => alert(this.props.id)}>
                <View style={[Styles.lessonItem, {backgroundColor:this.props.color}, this.props.pos == 0 ? {}: {marginLeft:12.5}]}>
                    <Text style={Styles.lessonItemTime}>{this.props.time}</Text>
                    <Text style={Styles.lessonItemDate}>{this.props.date}</Text>
                    <View style={Styles.lessonSubject}>
                        <Image source={Icons.subject} style={Styles.lessonSubjectImage} />
                        <Text style= {Styles.lessonSubjectName}>{this.props.subjectName}</Text>
                    </View>
                    <TouchableHighlight underlayColor={this.props.color} onPress={() => alert("Apagar")}>
                        <Image source={Icons.garbage} style={Styles.lessonItemDelete} />
                    </TouchableHighlight>
                </View>
            </TouchableHighlight>
        )
    }
}
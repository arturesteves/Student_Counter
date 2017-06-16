import React, {Component} from "react";
import {View, Text, Image, TouchableHighlight, Alert} from "react-native";
import Styles from "../styles/Styles.js";
import Icons from "../icons/icons.js";
import LessonLib from "../lib/Lesson.js";

export default class LessonItem extends React.Component{
    constructor(props){
        super(props);
    }

    deleteLesson(){
        let that = this;
        LessonLib.retrieve(this.props.id).then((lesson) => {
            lesson.delete();
            that.props.removeLesson(lesson.id);
        }).catch((err) => {
            alert(err);
        })
    }

    askForDelete(subjectName, date, time){
        Alert.alert(
            "Delete?",
            `Do you want to delete the lesson of ${subjectName} in ${date} at ${time}`,
            [
                {text: 'Delete', onPress: () => this.deleteLesson()},
                {text: "Don't Delete", onDismiss: () => {}}
            ]
        )
    }

    render(){
        return(
            <TouchableHighlight underlayColor={"white"} onPress={() => this.props.navigate("LessonInfo",{lessonId:this.props.id, classes:this.props.classes})}>
                <View style={[Styles.lessonItem, {backgroundColor:this.props.color}, this.props.pos == 0 ? {}: {marginLeft:12.5}]}>
                    <Text style={Styles.lessonItemTime}>{this.props.time}</Text>
                    <Text style={Styles.lessonItemDate}>{this.props.date}</Text>
                    <View style={Styles.lessonSubject}>
                        <Image source={Icons.subject} style={Styles.lessonSubjectImage} />
                        <Text style= {Styles.lessonSubjectName}>{this.props.subjectName}</Text>
                    </View>
                    <TouchableHighlight underlayColor={this.props.color} onPress={() => this.askForDelete(this.props.subjectName, this.props.date, this.props.time)}>
                        <Image source={Icons.garbage} style={Styles.lessonItemDelete} />
                    </TouchableHighlight>
                </View>
            </TouchableHighlight>
        )
    }
}
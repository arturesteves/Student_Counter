import React, {Component} from "react";
import {View, Text, Image, TouchableHighlight, Alert, StyleSheet} from "react-native";
import Styles from "../styles/Styles.js";
import LessonLib from "../lib/Lesson.js";
import Icons from "../icons/icons.js";

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
    //
    // render(){
    //     return(
    //         <TouchableHighlight underlayColor={"white"} onPress={() => this.props.navigate("LessonInfo",{lessonId:this.props.id, classes:this.props.classes})}>
    //             <View style={[Styles.lessonItem, {backgroundColor:this.props.color}, this.props.pos == 0 ? {}: {marginLeft:12.5}]}>
    //                 <Text style={Styles.lessonItemTime}>{this.props.time}</Text>
    //                 <Text style={Styles.lessonItemDate}>{this.props.date}</Text>
    //                 <View style={Styles.lessonSubject}>
    //                     <Image source={Icons.subject} style={Styles.lessonSubjectImage} />
    //                     <Text style= {Styles.lessonSubjectName}>{this.props.subjectName}</Text>
    //                 </View>
    //                 <TouchableHighlight underlayColor={this.props.color} onPress={() => this.askForDelete(this.props.subjectName, this.props.date, this.props.time)}>
    //                     <Image source={Icons.garbage} style={Styles.lessonItemDelete} />
    //                 </TouchableHighlight>
    //
    //                 <TouchableHighlight underlayColor={this.props.color} onPress={() => {console.log(this.props.lesson);this.props.navigate("LessonEdit", {lesson: this.props.lesson})}}>
    //                     <Image source={Icons.edit} style={Styles.lessonItemDelete} />
    //                 </TouchableHighlight>
    //             </View>
    //         </TouchableHighlight>
    //     )
    // }
    render(){
        return(
            <TouchableHighlight underlayColor={"white"} onPress={() => this.props.navigate("LessonInfo",{lessonId:this.props.id, classes:this.props.classes})}>
            <View style={styles.item}>
                <Text style={styles.label}>Subject: </Text><Text style={styles.name}>{this.props.subjectName}</Text>
                <Text style={styles.label}>Time: </Text><Text style={styles.name}>{this.props.time}</Text>
                <Text style={styles.label}>Date: </Text><Text style={[styles.name, {marginBottom: 6}]}>{this.props.date}</Text>
                {/*<Text style={styles.name}>{this.props.student.email}</Text>*/}
                <TouchableHighlight style={styles.deleteButton} underlayColor={this.props.color} onPress={() => {
                    return this.askForDelete(this.props.name)
                }}>
                    <Image source={Icons.deleteStudent} style={styles.deleteClass} />
                </TouchableHighlight>
                <TouchableHighlight style={styles.editButton} underlayColor={this.props.color} onPress={() => {
                    this.props.navigate("LessonEdit", {
                        student: this.props.student
                    })
                }}>
                    <Image source={Icons.editStudent} style={styles.editClass} />
                </TouchableHighlight>
            </View>
            </TouchableHighlight>
        )
    }
}

let styles = StyleSheet.create({
    item: {
        justifyContent:"space-between",
        padding:10,
        borderRadius:4,
        marginBottom:12.5,
        backgroundColor: "#EF9A9A"
    },
    label: {
        fontSize:25,
        fontFamily:"MedulaOne",
        color: "#000000",
    },
    name: {
        backgroundColor: "#efb9b7",
        color: "#110b0b",
        fontSize:16,
        marginTop: 2,
        paddingTop: 2,
        paddingBottom: 2,
        paddingLeft: 4,
        borderRadius: 2
    },
    deleteClass: {
        width:25,
        height:25,
    },
    deleteButton: {
        position: 'absolute',
        right:     4,
        top:      4,
    },
    editClass: {
        width:25,
        height:25,
    },
    editButton: {
        position: 'absolute',
        right:     30,
        top:      4,
    },
    imageItem: {
        width:25,
        height:25,
        marginRight:10,
    },
    studentsView: {
        marginTop:15,
        marginBottom:15,
        flexDirection:"row",
    },
    subjectsView: {
        marginTop:15,
        marginBottom:15,
        flexDirection:"row",
    },
    countClass: {},
});

/////////
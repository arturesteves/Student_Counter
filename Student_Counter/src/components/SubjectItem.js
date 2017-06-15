import React, {Component} from "react";
import {View, Text, Image, TouchableHighlight, Alert} from "react-native";
import Styles from "../styles/Styles.js";
import Icons from "../icons/icons.js";
import SubjectLib from "../lib/Subject.js";

export default class SubjectItem extends React.Component{
    constructor(props){
        super(props);
    }
    deleteSubject(){
        let that = this;
        SubjectLib.retrieve(this.props.id).then((subject) => {
            subject.delete();
            that.props.removeSubject(subject.id);
        }).catch((err) => {
            alert(err);
        })
    }

    askForDelete(subjectName){
        Alert.alert(
            "Delete?",
            `Do you want to delete the subject ${subjectName}`,
            [
                {text: 'Delete', onPress: () => this.deleteSubject()},
                {text: "Don't Delete", onDismiss: () => {}}
            ]
        )
    }

    render(){
        return(
            <TouchableHighlight underlayColor={"white"} onPress={() => alert("Subject:"+this.props.name)}>
                <View style={[Styles.subjectItem, {backgroundColor:this.props.color}]}>
                    <Text style={Styles.subjectItemText}>{this.props.name}</Text>
                    <TouchableHighlight underlayColor={this.props.color} onPress={() => this.askForDelete(this.props.name)}>
                    <Image source={Icons.garbage} style={Styles.lessonItemDelete} />
                    </TouchableHighlight>
                </View>
            </TouchableHighlight>
        )
    }
}
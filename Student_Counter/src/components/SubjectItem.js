import React, {Component} from "react";
import {StyleSheet,View, Text, Image, TouchableHighlight, Alert} from "react-native";
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

    // render(){
    //     return(
    //         <TouchableHighlight underlayColor={"white"} onPress={() => alert("Subject:"+this.props.name)}>
    //             <View style={[Styles.subjectItem, {backgroundColor:this.props.color}]}>
    //                 <Text style={Styles.subjectItemText}>{this.props.name}</Text>
    //                 <TouchableHighlight underlayColor={this.props.color} onPress={() => this.askForDelete(this.props.name)}>
    //                 <Image source={Icons.garbage} style={Styles.lessonItemDelete} />
    //                 </TouchableHighlight>
    //                 <TouchableHighlight underlayColor={this.props.color} onPress={() => this.props.navigate("SubjectEdit", {
    //                     subject: this.props.subject
    //                 })}>
    //                     <Image source={Icons.edit} style={Styles.lessonItemDelete} />
    //                 </TouchableHighlight>
    //             </View>
    //         </TouchableHighlight>
    //     )
    // }

    /////
    render(){
        return(

                <View style={styles.item}>
                    <Text style={styles.label}>Name: </Text><Text style={[styles.name, {marginBottom: 6}]}>{this.props.subject.name}</Text>
                    <Text style={styles.label}>Acronym: </Text><Text style={[styles.name, {marginBottom: 6}]}>{this.props.subject.acronym}</Text>

                    {/*<Text style={styles.name}>{this.props.student.email}</Text>*/}
                    <TouchableHighlight style={styles.deleteButton} underlayColor={this.props.color} onPress={() => {
                        return this.askForDelete(this.props.name)
                    }}>
                        <Image source={Icons.deleteStudent} style={styles.deleteClass} />
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.editButton} underlayColor={this.props.color} onPress={() => {
                        this.props.navigate("SubjectEdit", {
                            subject: this.props.subject
                        })
                    }}>
                        <Image source={Icons.editStudent} style={styles.editClass} />
                    </TouchableHighlight>
                </View>

        )
    }
}

let styles = StyleSheet.create({
    item: {
        justifyContent:"space-between",
        padding:10,
        borderRadius:4,
        marginBottom:12.5,
        paddingTop: 20,
        backgroundColor: "#90CAF9"
    },
    label: {
        fontSize:25,
        fontFamily:"MedulaOne",
        color: "#000000",
    },
    name: {
        backgroundColor: "#aed3f9",
        color: "#110b0b",
        fontSize:16,
        marginTop: 2,
        paddingTop: 2,
        paddingBottom: 2,
        paddingLeft: 4,
        borderRadius: 2
    },
    deleteClass: {
        width:35,
        height:35,
    },
    deleteButton: {
        position: 'absolute',
        right:     8,
        top:      4,
    },
    editClass: {
        width:35,
        height:35,
    },
    editButton: {
        position: 'absolute',
        right:     42,
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

import React from "react";
import {StyleSheet, View, Text, Image, TouchableHighlight, Alert} from "react-native";
import StudentLib from "../lib/Student.js";
import Icons from "../icons/icons.js";

export default class StudentItem extends React.Component{
    constructor(props){
        super(props);
    }

    deleteStudent(){
        let that = this;
        StudentLib.retrieve(this.props.id).then((student) => {
            student.delete();
            that.props.removeStudent(student.id);
        }).catch((err) => {
            alert(err);
        })
    }


    askForDelete(){
        Alert.alert( "Delete?",`Do you want to delete the student ${this.student.name}`, [
                {text: 'Delete', onPress: () => this.deleteClass()},
                {text: "Don't Delete", onDismiss: () => {}}
            ]
        )
    }

    render(){
        return(
            <TouchableHighlight underlayColor={"white"} onPress={() => {
                return this.props.navigate("StudentInfo", );
            }}>
                <View style={styles.item}>
                    <Text style={styles.name}>{this.props.student.number}</Text>
                    <Text style={styles.name}>{this.props.student.name}</Text>
                    <Text style={styles.name}>{this.props.student.email}</Text>
                    <TouchableHighlight underlayColor={this.props.color} onPress={() => {
                        return this.askForDelete(this.props.name)
                    }}>
                        <Image source={Icons.garbage} style={styles.deleteClass} />
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
        backgroundColor: "#ef9a9a"
    },
    name: {
        fontSize:16,
    },
    deleteClass: {
        width:25,
        height:25,
        alignSelf:"flex-end"
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

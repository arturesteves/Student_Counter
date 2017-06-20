import React from "react";
import {StyleSheet, View, Text, Image, TouchableHighlight, Alert} from "react-native";
import StudentLib from "../lib/Student.js";
import Icons from "../icons/icons.js";
import { Icon } from 'react-native-elements'

export default class StudentItem extends React.Component{
    constructor(props){
        super(props);
    }

    deleteStudent(){
        this.props.student.delete();
        this.props.removeStudent(this.number);
    }
/////

    askForDelete(){
        Alert.alert( "Delete?",`Do you want to delete the student ${this.props.student.name}`, [
                {text: 'Delete', onPress: () => this.deleteStudent()},
                {text: "Don't Delete", onDismiss: () => {}}
            ]
        )
    }

    /////
    render(){
        return(

                <View style={styles.item}>
                    <Text style={styles.label}>Number: </Text><Text style={[styles.name, {marginBottom: 6}]}>{this.props.student.number}</Text>
                    <Text style={styles.label}>Name: </Text><Text style={styles.name}>{this.props.student.name}</Text>
                    {/*<Text style={styles.name}>{this.props.student.email}</Text>*/}
                    <TouchableHighlight style={styles.deleteButton} underlayColor={this.props.color} onPress={() => {
                        return this.askForDelete(this.props.name)
                    }}>
                        <Image source={Icons.deleteStudent} style={styles.deleteClass} />
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.editButton} underlayColor={this.props.color} onPress={() => {
                        this.props.navigate("StudentEdit", {
                            student: this.props.student
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
        backgroundColor: "#FFAB91"
    },
    label: {
        fontSize:25,
        fontFamily:"MedulaOne",
        color: "#000000",
    },
    name: {
        backgroundColor: "#ffc3ad",
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

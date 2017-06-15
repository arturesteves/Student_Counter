import React from "react";
import {StyleSheet, View, Text, Image, TouchableHighlight, Alert} from "react-native";
import ClassLib from "../lib/Class.js";
import Icons from "../icons/icons.js";

export default class ClassItem extends React.Component{
    constructor(props){
        super(props);
    }

    deleteClass(){
        let that = this;
        ClassLib.retrieve(this.props.id).then((clazz) => {
            clazz.delete();
            that.props.removeClass(clazz.id);
        }).catch((err) => {
            alert(err);
        })
    }

    askForDelete(){
        Alert.alert( "Delete?",`Do you want to delete the class ${this.name}`, [
                {text: 'Delete', onPress: () => this.deleteClass()},
                {text: "Don't Delete", onDismiss: () => {}}
            ]
        )
    }

    render(){
        return(
            <TouchableHighlight underlayColor={"white"} onPress={() => {
                return this.props.navigate("LessonInfo", );
            }}>
                <View style={styles.item}>
                    <Text style={styles.name}>{this.props.name}</Text>
                    <View style={styles.studentsView}>
                        <Image source={Icons.student} style={styles.imageItem} />
                        <Text style= {styles.countClass}>{this.props.countStudents}</Text>
                    </View>
                    <View style={styles.subjectsView}>
                        <Image source={Icons.subject} style={styles.imageItem} />
                        <Text style= {styles.countClass}>{this.props.countStudents}</Text>
                    </View>
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
        flexDirection:"row",
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

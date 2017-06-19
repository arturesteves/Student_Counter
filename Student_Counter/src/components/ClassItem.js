import React from "react";
import {StyleSheet, View, Text, Image, TouchableHighlight, Alert} from "react-native";
import ClassLib from "../lib/Class.js";
import Icons from "../icons/icons.js";

export default class ClassItem extends React.Component {
    constructor(props) {
        super(props);
    }

    deleteClass() {
        let that = this;
        ClassLib.retrieve(this.props.id).then((clazz) => {
            clazz.delete();
            that.props.removeClass(clazz.name);
        }).catch((err) => {
            alert(err);
        })
    }

    askForDelete() {
        Alert.alert("Delete?", `Do you want to delete the class ${this.props.id}`, [
                {text: 'Delete', onPress: () => this.deleteClass()},
                {
                    text: "Don't Delete", onDismiss: () => {
                }
                }
            ]
        )
    }

    // render(){
    //     return(
    //         <TouchableHighlight underlayColor={"white"} onPress={() => {
    //             alert("Class:"+this.props.id)
    //         }}>
    //             <View style={styles.item}>
    //                 <Text style={styles.name}>{this.props.clazz.name}</Text>
    //                 <View style={styles.studentsView}>
    //                     <Image source={Icons.student} style={styles.imageItem} />
    //                     <Text style= {styles.countClass}>{this.props.countStudents}</Text>
    //                 </View>
    //                 <View style={styles.subjectsView}>
    //                     <Image source={Icons.subject} style={styles.imageItem} />
    //                     <Text style= {styles.countClass}>{this.props.countSubjects}</Text>
    //                 </View>
    //                 <TouchableHighlight underlayColor={this.props.color} onPress={() => {
    //                     return this.askForDelete(this.props.name)
    //                 }}>
    //                     <Image source={Icons.garbage} style={styles.deleteClass} />
    //                 </TouchableHighlight>
    //                 <TouchableHighlight underlayColor={this.props.color} onPress={() => {
    //                     this.props.navigate("ClassEdit", {clazz: this.props.clazz})
    //                 }}>
    //                     <Image source={Icons.edit} style={styles.deleteClass} />
    //                 </TouchableHighlight>
    //             </View>
    //         </TouchableHighlight>
    //     )
    render() {
        return (

            <View style={styles.item}>
                <Text style={styles.label}>Name: </Text><Text
                style={[styles.name, {marginBottom: 6}]}>{this.props.id}</Text>
                <Text style={styles.label}>Students: </Text><Text
                style={[styles.name, {marginBottom: 6}]}>{this.props.countStudents}</Text>
                <Text style={styles.label}>Subjects: </Text><Text
                style={[styles.name, {marginBottom: 6}]}>{this.props.countSubjects}</Text>

                {/*<Text style={styles.name}>{this.props.student.email}</Text>*/}
                <TouchableHighlight style={styles.deleteButton} underlayColor={this.props.color} onPress={() => {
                    return this.askForDelete(this.props.name)
                }}>
                    <Image source={Icons.deleteStudent} style={styles.deleteClass}/>
                </TouchableHighlight>
                <TouchableHighlight style={styles.editButton} underlayColor={this.props.color} onPress={() => {

                        this.props.navigate("ClassEdit", {clazz: this.props.clazz})
                  
                }}>
                    <Image source={Icons.editStudent} style={styles.editClass}/>
                </TouchableHighlight>
            </View>

        )
    }
}

let styles = StyleSheet.create({
    item: {
        justifyContent: "space-between",
        padding: 10,
        borderRadius: 4,
        marginBottom: 12.5,
        backgroundColor: "#9FA8DA"
    },
    label: {
        fontSize: 25,
        fontFamily: "MedulaOne",
        color: "#000000",
    },
    name: {
        backgroundColor: "#bbc2da",
        color: "#110b0b",
        fontSize: 16,
        marginTop: 2,
        paddingTop: 2,
        paddingBottom: 2,
        paddingLeft: 4,
        borderRadius: 2
    },
    deleteClass: {
        width: 25,
        height: 25,
    },
    deleteButton: {
        position: 'absolute',
        right: 4,
        top: 4,
    },
    editClass: {
        width: 25,
        height: 25,
    },
    editButton: {
        position: 'absolute',
        right: 30,
        top: 4,
    },
    imageItem: {
        width: 25,
        height: 25,
        marginRight: 10,
    },
    studentsView: {
        marginTop: 15,
        marginBottom: 15,
        flexDirection: "row",
    },
    subjectsView: {
        marginTop: 15,
        marginBottom: 15,
        flexDirection: "row",
    },
    countClass: {},
});
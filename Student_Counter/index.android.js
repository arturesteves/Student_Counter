/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View
} from 'react-native';

import camera from './src/components/camera';
import Student from './src/lib/Student';
import Teacher from "./src/lib/Teacher";
import Subject from "./src/lib/Subject";
import Class from "./src/lib/Class";
import Lesson from "./src/lib/Lesson";

import * as firebase from 'firebase';

// Initialize Firebase
firebase.initializeApp({
    apiKey: "AIzaSyCJO-fJa5dlYXKK1zy8bt4TxzwoniSvtsU",
    authDomain: "gpbitteam-59ca2.firebaseapp.com",
    databaseURL: "https://gpbitteam-59ca2.firebaseio.com",
    projectId: "gpbitteam-59ca2",
    storageBucket: "gpbitteam-59ca2.appspot.com",
    messagingSenderId: "571714718837"
});

export default class Student_Counter extends Component {


    componentWillMount() {
        this.init().then();
    }

    async init() {
        this.signup("artur_esteves1995@hotmail.com", "pw_test1");
        this.login("artur_esteves1995@hotmail.com", "pw_test1");
        //let student_artur = new Subject('140221076', 'Artur', 'Esteves');

        let teacher_JF = new Teacher("Joaquim Filipe", " jf@...");
        let teacher_JV = new Teacher("João Ventura", "jv@...");

        await teacher_JF.save();
        await teacher_JV.save();

        let student1 = new Student("140221066", "Ricardo Morais", new Date().toISOString(), "moraispgsi@gmail.com", "src/image1");
        let student2 = new Student("140221067", "Bruno Batista", new Date().toISOString(), "batistamofo@gmail.com", "src/image2");

        await student1.save();
        await student2.save();

        let subject1 = new Subject("Gestão de Projeto", [teacher_JF.id, teacher_JV.id]);
        let subject2 = new Subject("DBM", [teacher_JF.id]);

        await subject1.save();
        await subject2.save();

        let clazz1 = new Class("class1", [student1.number,student2.number], [subject1.id, subject2.id]);
        let clazz2 = new Class("class2", [student1.number,student2.number], [subject2.id]);

        await clazz1.save();
        await clazz2.save();

        let lesson1 = new Lesson(teacher_JV.id, subject1.id, new Date().toISOString(), new Date().toISOString(), "src/image3");
        lesson1.save();
        
        this.logout();
    }

    // Signup Function
    async signup(email, pass) {
        try {
            await firebase.auth().createUserWithEmailAndPassword(email, pass);
           // console.log("Account Created");
        } catch (error) {
            //console.log(error.toString());
        }
    }

    // Login Function
    async login(email, pass) {
        try {
            await firebase.auth().signInWithEmailAndPassword(email, pass);
          //  console.log("Logged In!");
        } catch (error) {
           // console.log(error.toString())
        }
    }

    // Logout Function
    async logout() {
        try {
            await firebase.auth().signOut();
        } catch (error) {
           // console.log(error);
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <camera/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});

AppRegistry.registerComponent('Student_Counter', () => Student_Counter);

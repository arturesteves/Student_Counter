/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
//import Student from './src/lib/Student';
import Teacher from "./src/lib/Teacher";

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

  async init(){
      this.signup("artur_esteves1995@hotmail.com", "pw_test1");
      this.login("artur_esteves1995@hotmail.com", "pw_test1");
      //var student_artur = new Student('140221076', 'Artur', 'Esteves');

      var teacher_JF = new Teacher("Joaquim ... Filipe", " jf@...");
      await teacher_JF.save();

      var teacher_JV = new Teacher("João Ventura", "jv@...");
      await teacher_JV.save();

      this.logout();
  }

  // Signup Function
  async signup(email, pass) {
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, pass);
      //console.log("Account Created");
    } catch (error) {
      //console.log(error.toString());
    }
  }

  // Login Function
  async login(email, pass) {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, pass);
      //console.log("Logged In!");
    } catch (error) {
      //console.log(error.toString())
    }
  }

  // Logout Function
  async logout() {
    try {
        await firebase.auth().signOut();
    } catch (error) {
        //console.log(error);
    }
}

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.android.js
        </Text>
        <Text style={styles.instructions}>
          Double tap R on your keyboard to reload,{'\n'}
          Shake or press menu button for dev menu
        </Text>
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

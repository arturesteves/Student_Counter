/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from "react";
import {
    AppRegistry,
    StyleSheet,
    Text,
    View
} from "react-native";

let firebase = require("firebase");
import { Dimensions } from "react-native";
import { DrawerNavigator} from "react-navigation";
import HomeScreen from "./src/screens/Home";
import Drawer from "./src/components/Drawer";
import LessonScreen from "./src/screens/Lesson";
import LessonCreateScreen from "./src/screens/LessonCreate";
import SubjectScreen from "./src/screens/Subject";
import SubjectCreateScreen from "./src/screens/SubjectCreate";
import TeacherScreen from "./src/screens/Teacher";
import TeacherCreateScreen from "./src/screens/TeacherCreate";
import StudentScreen from "./src/screens/Student";
import StudentCreateScreen from "./src/screens/StudentCreate";
import ClassScreen from "./src/screens/Class";
import ClassCreateScreen from "./src/screens/ClassCreate";
import LessonInfo from "./src/screens/LessonInfo";

import firebaseInit from "./firebase";

// Initialize Firebase
firebase.initializeApp({
    apiKey: "AIzaSyCY6sw4EPi-TJIbGueUVlhtJWAeOvdpafw",
    authDomain: "gpbitteamapk.firebaseapp.com",
    databaseURL: "https://gpbitteamapk.firebaseio.com",
    projectId: "gpbitteamapk",
    storageBucket: "gpbitteamapk.appspot.com",
    messagingSenderId: "598118677181"
});

// firebaseInit().then();


const MyApp = DrawerNavigator({
    Home: {
        screen: HomeScreen
    },
    Lesson:{
        screen: LessonScreen
    },
    LessonCreate:{
        screen: LessonCreateScreen
    },
    Subject:{
        screen: SubjectScreen
    },
    SubjectCreate:{
        screen: SubjectCreateScreen
    },
    Teacher:{
        screen: TeacherScreen
    },
    TeacherCreate:{
        screen: TeacherCreateScreen
    },
    Student:{
        screen: StudentScreen
    },
    StudentCreate:{
        screen: StudentCreateScreen
    },
    Class:{
        screen: ClassScreen
    },
    ClassCreate:{
        screen: ClassCreateScreen
    },
    LessonInfo:  {
        screen: LessonInfo
    }
},{
    drawerWidth: Dimensions.get("window").width * 3/4,
    contentComponent: props => <Drawer navigate={props.navigation.navigate} />
});

AppRegistry.registerComponent('Student_Counter', () => MyApp);

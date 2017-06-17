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
import LessonEditScreen from "./src/screens/LessonEdit";
import SubjectScreen from "./src/screens/Subject";
import SubjectCreateScreen from "./src/screens/SubjectCreate";
import TeacherScreen from "./src/screens/Teacher";
import TeacherCreateScreen from "./src/screens/TeacherCreate";
import StudentScreen from "./src/screens/Student";
import StudentCreateScreen from "./src/screens/StudentCreate";
import ClassScreen from "./src/screens/Class";
import ClassCreateScreen from "./src/screens/ClassCreate";
import LessonInfo from "./src/screens/LessonInfo";
import Metrics from "./src/screens/Metrics";
import firebaseInit from "./firebase";

// Initialize Firebase
firebase.initializeApp({
    apiKey: "AIzaSyCJO-fJa5dlYXKK1zy8bt4TxzwoniSvtsU",
    authDomain: "gpbitteam-59ca2.firebaseapp.com",
    databaseURL: "https://gpbitteam-59ca2.firebaseio.com",
    projectId: "gpbitteam-59ca2",
    storageBucket: "gpbitteam-59ca2.appspot.com",
    messagingSenderId: "571714718837"
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
    LessonEdit:{
        screen: LessonEditScreen
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
    },
    Metrics:{
        screen: Metrics
    }
},{
    drawerWidth: Dimensions.get("window").width * 3/4,
    contentComponent: props => <Drawer navigate={props.navigation.navigate} />
});

AppRegistry.registerComponent('Teachelp', () => MyApp);

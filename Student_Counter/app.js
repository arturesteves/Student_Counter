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
import TeacherScreen from "./src/screens/Teacher";
import StudentScreen from "./src/screens/Student";
import StudentCreateScreen from "./src/screens/StudentCreate";
import ClassScreen from "./src/screens/Class";
import LessonInfo from "./src/screens/LessonInfo";

//import firebaseInit from "./firebase";

//firebaseInit().then();

// Initialize Firebase
firebase.initializeApp({
    apiKey: "AIzaSyCJO-fJa5dlYXKK1zy8bt4TxzwoniSvtsU",
    authDomain: "gpbitteam-59ca2.firebaseapp.com",
    databaseURL: "https://gpbitteam-59ca2.firebaseio.com",
    projectId: "gpbitteam-59ca2",
    storageBucket: "gpbitteam-59ca2.appspot.com",
    messagingSenderId: "571714718837"
});

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
    Teacher:{
        screen: TeacherScreen
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
    LessonInfo:{
        screen: LessonInfo
    }
},{
    drawerWidth: Dimensions.get("window").width * 3/4,
    contentComponent: props => <Drawer navigate={props.navigation.navigate} />
});

AppRegistry.registerComponent('Student_Counter', () => MyApp);

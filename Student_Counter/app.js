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

let Class = require("./src/lib/Class");
let Lesson = require("./src/lib/Lesson");
let Presence = require("./src/lib/Presence");
let Student = require("./src/lib/Student");
let Subject = require("./src/lib/Subject");
let Teacher = require("./src/lib/Teacher");

import { Dimensions } from "react-native";
import { DrawerNavigator} from "react-navigation";
import HomeScreen from "./src/screens/Home";
import Drawer from "./src/components/Drawer";
import LessonScreen from "./src/screens/Lesson";
import StudentCreateScreen from "./src/screens/StudentCreate";
import SubjectScreen from "./src/screens/Subject";
import TeacherScreen from "./src/screens/Teacher";
import StudentScreen from "./src/screens/Student";
import ClassScreen from "./src/screens/Class";

import firebaseInit from "./firebase";

// firebaseInit().then();


const MyApp = DrawerNavigator({
    Home: {
        screen: HomeScreen
    },
    Lesson:{
        screen: LessonScreen
    },
    StudentCreate:{
        screen: StudentCreateScreen
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
    Class:{
        screen: ClassScreen
    }
},{
    drawerWidth: Dimensions.get("window").width * 3/4,
    contentComponent: props => <Drawer navigate={props.navigation.navigate} />
});

AppRegistry.registerComponent('Student_Counter', () => MyApp);

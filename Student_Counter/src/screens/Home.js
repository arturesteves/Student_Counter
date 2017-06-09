import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button,
    Dimensions,
    Image,
    TouchableHighlight,
} from "react-native";
import { DrawerNavigator } from "react-navigation";
import Header from "../components/Header"
import HomeContent from "../components/HomeContent"
import Drawer from "../components/Drawer";
import Lesson from "./Lesson";
import Subject from "./Subject";
import Teacher from "./Teacher";
import Student from "./Student";
import Class from "./Class";
import CameraScreen from "../components/CameraScreen.js";


class Home extends React.Component {
    static navigationOptions = {
        drawerLabel: "Home",
    }
    render(){
        const { navigate } = this.props.navigation;
        return(
            <View>
                <Header navigate={navigate} text="Teachelp"/>
                <HomeContent navigate={navigate} />
            </View>
        )
    }
}

const MyApp = DrawerNavigator({
    Home: {
        screen: Home
    },
    Lesson:{
        screen: Lesson
    },
    Subject:{
        screen:Subject
    },
    Teacher:{
        screen:Teacher
    },
    Student:{
        screen:Student
    },
    Class:{
        screen:Class
    },
    Camera:{
        screen: CameraScreen
    }
},{
    drawerWidth: Dimensions.get("window").width * 3/4,
    contentComponent: props => <Drawer navigate={props.navigation.navigate} />
})

export default MyApp;
import React, {Component} from 'react';
import {
    BackHandler,
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
import Styles from "../styles/Styles.js";
import Icons from "../icons/icons.js"
import TeacherLib from '../lib/Teacher';
import Spinner from 'react-native-loading-spinner-overlay';
let SharedPreferences = require('react-native-shared-preferences');


export default class Teacher extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            isLoading: false,
            teacher: {}
        };
    }

    componentWillMount(){
        BackHandler.addEventListener('hardwareBackPress',()=>{
            this.props.navigation.navigate("Home");
            return true;
        });
    }

    componentDidMount(){
        let that = this;
        SharedPreferences.getItem("id", function(value){
            if(value){
                that.setState( {isLoading: true});
                //retrieve teacher
                TeacherLib.retrieve(value).then(function(teacher){
                    that.setState( {isLoading: false});
                    that.setState( {teacher: teacher});

                    teacher.getAllSubjects().then(function(subjects){
                       console.log("Subjects of " + teacher.name, subjects);
                       let _techear = that.state.teacher;
                       _techear.numbSubjects = subjects.length;

                       that.setState( {teacher: _techear} );

                    });

                    teacher.getAllClasses().then(function(classes){
                        console.log("classes of " + teacher.name, classes);
                        let _techear = that.state.teacher;
                        _techear.numbClasses = classes.length;

                        that.setState( {teacher: _techear} );
                    });

                    teacher.getNumStudents().then(function(numStudents){
                        let teacher = that.state.teacher;
                        teacher.numStudents = numStudents;

                        that.setState( {teacher: teacher});
                    });

                }).catch(function(error){
                    that.setState( {isLoading: false});
                    alert("error");
                    console.log("error: ", error.message);
                })
            }else{
                alert("Not logged in");
            }
        })
    }

    static navigationOptions = {
        drawerLabel: "Teacher",
    };


    render(){
        const { navigate } = this.props.navigation;
        return(
            <View>
                <Spinner visible={this.state.isLoading} textContent={"Talking to the Database"} textStyle={{color: '#FFF'}} />
                <Header navigate={navigate} text="Teacher"/>
                <View style={Styles.teacherContent}>
                    <Image source={require("../icons/userPic.png")} style={Styles.teacherImage}/>
                    <View style={Styles.teacherInfo}>
                        <Text style={Styles.teacherInfoText}>{this.state.teacher.name}</Text>
                    </View>
                    <View style = {Styles.teacherNumbers}>
                        <Image source={Icons.subject} style={Styles.teacherNumberIcon} />
                        <Text style={Styles.teacherNumberText}>{this.state.teacher.numbSubjects}</Text>
                        <Image source={Icons.class} style={Styles.teacherNumberIcon} />
                        <Text style={Styles.teacherNumberText}>{this.state.teacher.numbClasses}</Text>
                        <Image source={Icons.student} style={Styles.teacherNumberIcon} />
                        <Text style={Styles.teacherNumberText}>{this.state.teacher.numStudents}</Text>
                    </View>
                </View>
            </View>
        )
    }
}
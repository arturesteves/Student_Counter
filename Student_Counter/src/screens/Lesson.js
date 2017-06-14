import React, {Component} from 'react';
import {
    Text,
    View,
    Button,
    Dimensions,
    ScrollView
} from "react-native";
import Header from "../components/Header"
import Styles from "../styles/Styles.js";
import LessonItem from "../components/LessonItem.js";
import LessonLib from "../lib/Lesson.js";
import SubjectLib from "../lib/Subject.js";


export default class Lesson extends React.Component {
    static navigationOptions = {
        drawerLabel: undefined,
    };

    constructor(){
        super();
        this.state = {
            lessons: <Text></Text>,
        }
    }

    removeLesson(key){
        let lessons = this.state.lessons;
        console.log(lessons);
        let nLessons = lessons.map((lesson) => {
            if(lesson.key != key){
                return lesson
            }
        });
        this.setState({
            lessons: nLessons
        })
    }

    componentDidMount(){
        this.getLessonItems();
    }
    getAllLessons(){
        return new Promise((resolve, reject) => {
            LessonLib.all().then((lessons) => resolve(lessons)).catch((err)=> reject(err))
        })
    }
    getLessonItems(){
        let that = this;
        this.getAllLessons()
        .then((lessons) => {
            let pos = 1;
            let all = lessons.map((lesson) => {
                return SubjectLib.retrieve(lesson.subjectId).then((subject) => {
                    console.log(subject);
                    return subject;
                })
            });
            Promise.all(all).then((subjects) => {
                let lessonItems = lessons.map((lesson, index) => {
                    let classes = lesson.classes;
                    let nDate = new Date(lesson.startDate);
                    let date = `${nDate.getDate()}/${nDate.getMonth()}/${nDate.getFullYear()}`;
                    let time = `${nDate.getHours()}:${nDate.getMinutes()}`;
                    pos == 0 ? pos = 1 : pos= 0;
                    return <LessonItem key={lesson.id} removeLesson={this.removeLesson.bind(this)} id={lesson.id} time={time} date={date} pos={pos} subjectName={subjects[index].acronym} subjectId={subjects[index].id} classes={classes} color="#ef9a9a" navigate={that.props.navigation.navigate}/>
                });
                this.setState({
                    lessons:lessonItems,
                })
            })
        })
        .catch((err) => {
            console.log(err)
        })
    }
    render(){
        const { navigate } = this.props.navigation;
        return(
            <View>
                <Header navigate={navigate} text="Lesson"/>
                <ScrollView height={Dimensions.get("window").height-90} showsVerticalScrollIndicator={false}>
                <Button onPress={() => navigate('LessonCreate')} title="Create new lesson" />
                <View style={Styles.lessonContent}>
                    {this.state.lessons}
                </View>
                </ScrollView>
            </View>
        )
    }
}
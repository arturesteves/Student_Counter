import React, {Component} from 'react';
import {
    BackHandler,
    Text,
    View,
    Button,
    Dimensions,
    ScrollView,
    StyleSheet

} from "react-native";
import Header from "../components/Header";
import Styles from "../styles/Styles.js";
import LessonItem from "../components/LessonItem.js";
import LessonLib from "../lib/Lesson.js";
import SubjectLib from "../lib/Subject.js";
import Spinner from 'react-native-loading-spinner-overlay';
import { Icon } from 'react-native-elements'
import { NavigationActions } from 'react-navigation'


export default class Lesson extends React.Component {
    static navigationOptions = {
        drawerLabel: undefined,
    };

    constructor(){
        super();
        this.state = {
            lessons: undefined,
            isLoading:true,
        }
    }

    componentWillMount(){
        BackHandler.addEventListener('hardwareBackPress',()=>{
            this.props.navigation.navigate("Home");
            return true;
        });
    }

    removeLesson(key){
        let nLessons = this.state.lessons.filter((lesson) => lesson.key != key);
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
                        return <LessonItem key={lesson.id} removeLesson={this.removeLesson.bind(this)} lesson={lesson} id={lesson.id} time={time} date={date} pos={pos} subjectName={subjects[index].acronym} subjectId={subjects[index].id} classes={classes} color="#ef9a9a" navigate={that.props.navigation.navigate}/>
                    });
                    this.setState({
                        lessons:lessonItems,
                        isLoading:!this.state.isLoading
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
                <Spinner visible={this.state.isLoading} textContent={"Talking to the Database"} textStyle={{color: '#FFF'}} />
                <Header navigate={navigate} text="Lesson"/>

                <ScrollView height={Dimensions.get("window").height-90} showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        {this.state.lessons}
                    </View>
                </ScrollView>
                <View style={styles.add}>
                    <Icon
                        reverse
                        name='plus'
                        type = "font-awesome"
                        color='#000'
                        onPress={() => this.props.navigation.navigate('LessonCreate')}
                    />
                </View>
            </View>
        )
    }
}
///////

let styles = StyleSheet.create({

    content: {
        flexWrap: "wrap",
        marginTop: 15,
        marginLeft: 35,
        marginRight: 35,
    },
    add: {
        position: 'absolute',
        right:     4,
        bottom:      4,
    }


});

import React from 'react';
import {View, Text} from "react-native";
import Header from "../components/Header";
import HomeContent from "../components/HomeContent";
import LessonLib from "../lib/Lesson";
import ClassLib from "../lib/Class";
import StudentLib from "../lib/Student";
import PresenceLib from "../lib/Presence";
import PresenceItem from "../components/PresenceItem";
import { List } from 'react-native-elements'

export default class LessonInfo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            presenceItems:undefined,
        }
    }

    componentDidMount() {
        let that = this;
        let classes = this.props.navigation.state.params.classes;        
        if(classes.length != 0){
            let allStudentsIds = classes.map((_class) =>{
                return _class.studentIds;
            })
            that.getStudents(allStudentsIds);
        }
    }

    getStudents(allStudentsIds){
        let that = this;
        let allPromises = [];
        allStudentsIds.map((currentStudentIds) => {
            currentStudentIds.map((studentId) => {
                allPromises.push(StudentLib.retrieve(studentId));
            })
        })
        Promise.all(allPromises)
        .then(allClassStudents =>{   
            let presenceItemsInner = [];       
            let presenceItems = allClassStudents.map((student) => {
                    PresenceLib.all().then((presences) => {
                        presences.map((presence) => {
                            //Checks if the lesson we are currently in is the same as the lesson retrieved from the database
                            if(this.props.navigation.state.params.lessonId == presence.lessonId){
                                if(student.number == presence.studentId){
                                    presenceItemsInner.push(<PresenceItem key={student.number} number={student.number} studentName={student.name} lessonId={presence.lessonId} presenceId={presence.id}/>)
                                }else{
                                    presenceItemsInner.push(<PresenceItem key={student.number} number={student.number} studentName={student.name} lessonId={presence.lessonId}/>)
                                }
                            }
                        })
                    }).then(()=>{
                        this.setState({
                            presenceItems: presenceItemsInner
                        })
                    }).catch((err) => console.log(err))
            })

        })
        .catch((err) => {
            alert("Oi Something Went Wrong");
        })
    }

    static navigationOptions = {
        drawerLabel: "LessonInfo",
    };

    render(){
        const { navigate } = this.props.navigation;
        return(
            <View>
                <Header navigate={navigate} text="Lesson Info"/>
                <Text>LessonInfo</Text>
                <List containerStyle={{marginBottom: 20}}>
                    {this.state.presenceItems}
                </List>
            </View>
        )
    }
}

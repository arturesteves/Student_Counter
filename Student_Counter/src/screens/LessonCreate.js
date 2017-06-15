/**
 * Created by Ricardo Morais on 10/06/2017.
 */
import Lesson from '../lib/Lesson';
import React from 'react';
import { View, Text, Button, Picker } from "react-native";
import EntityPicker from "../components/EntityPicker";
import DatePicker from 'react-native-datepicker';
import Header from "../components/Header";
import ClassLib from "../lib/Class";
import SubjectLib from "../lib/Subject";
import TeacherLIb from "../lib/Teacher";

export default class LessonCreate extends React.Component {

    constructor(props){
        super(props);
        this.state = {
        dateStart: "2016-05-09, 1:00 am",
        dateEnd: "2016-05-09, 1:00 am",
        selectTeacher:0,
        teacherItems:[<Picker.Item key={0} label={"Select Teacher"} value={0} />],
        selectSubject:0,
        subjectItems:[<Picker.Item key={0} label={"Select Subject"} value={0} />]
        }
    }

    static navigationOptions = {
        drawerLabel: undefined,
    };

    create(){
        let that = this;
        if(this.state.selectTeacher == 0 || this.state.selectSubject == 0){
            this.state.selectTeacher == 0 ? alert("You need to choose a teacher") : alert("You need to choose a subject");
            return null
        }
        ClassLib.all().then((classes) =>{
            let eligibleClasses = [];
            classes.map((_class) => {
                _class.subjectIds.map((subjectId) => {
                    if(subjectId == that.state.selectSubject){
                        console.log(_class);
                        eligibleClasses.push(_class.name);
                    }
                })
            })

            if(eligibleClasses.length == 0){
                alert("There are no classes available in this subject");
                return null;
            }

            let lesson = new Lesson(that.state.selectTeacher,
                that.state.selectSubject,eligibleClasses,
                new Date(this.state.dateStart).toISOString(),
                new Date(this.state.dateEnd).toISOString());
            
            lesson.save().then(()=>{
                this.props.navigation.navigate('Lesson');
            }).catch((err) =>{
                console.log(err);
                alert("Something went wrong");
            });
        }).catch((err) =>{
                console.log(err);
                alert("Something went wrong");
        });
    
    }
    componentDidMount(){
        this.getTeachers();
    }
    getTeachers(){
        let eligibleTeachers = [];
        TeacherLIb.all().then((teachers) => {
            if(teachers.length == 0){
                return null;
            }
            SubjectLib.all().then((subjects) => {
                if(subjects.length == 0){
                return null;
                }
                subjects.map((subject) => {
                    subject.overseersIds.map((overseerId) => {
                        teachers.map((teacher) =>{
                            if(teacher.id == overseerId){
                                if(!eligibleTeachers.includes(teacher)){
                                    eligibleTeachers.push(teacher);
                                }
                            }
                        })
                    })
                })
                let teacherItems = eligibleTeachers.map((teacher) => {
                    return <Picker.Item key={teacher.id} label={teacher.name} value={teacher.id} />
                })
                this.setState({
                    teacherItems:teacherItems
                })
            })
        })
    }
    getTeacherSubjects(teacherId){
        SubjectLib.all().then((subjects) => {
            let eligibleSubjects = [];
            subjects.map((subject) => {
                subject.overseersIds.map((overseerId) => {
                    if(overseerId == teacherId){
                        eligibleSubjects.push(subject);
                    }
                })
            })
            let subjectItems = eligibleSubjects.map((subject) =>{
                return <Picker.Item key={subject.id} label={subject.acronym} value={subject.id} />
            })
            this.setState({
                subjectItems:subjectItems
            })
        })
    }

    render(){
        const { navigate } = this.props.navigation;
        let that = this;
        return(
            <View>
                <Header navigate={navigate} text="Create Lesson"/>
                <Text>Select the teacher:</Text>
                <Picker
                selectedValue={this.state.selectTeacher}
                onValueChange={(itemValue, itemIndex) => {
                    this.setState({selectTeacher: itemValue})
                    this.getTeacherSubjects(itemValue);
                }}>
                {this.state.teacherItems}
                </Picker>
                <Text>Select the subject:</Text>
                <Picker
                selectedValue={this.state.selectSubject}
                onValueChange={(itemValue, itemIndex) => {
                    this.setState({selectSubject: itemValue})
                }}>
                {this.state.subjectItems}
                </Picker>
                <Text>Select lesson start date and time:</Text>
                <DatePicker
                    style={{width: 200}}
                    date={this.state.dateStart}
                    mode="datetime"
                    placeholder="select date"
                    format="YYYY-MM-DD hh:mm"
                    is24Hour={true}
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                        dateIcon: {
                            position: 'absolute',
                            left: 0,
                            top: 4,
                            marginLeft: 0
                        },
                        dateInput: {
                            marginLeft: 36
                        }
                    }}
                    onDateChange={(date) => {
                        this.setState({
                            dateStart:date
                        });
                    }}
                />
                <Text>Select lesson end date and time:</Text>
                <DatePicker
                    style={{width: 200}}
                    date={this.state.dateEnd}
                    mode="datetime"
                    placeholder="select date"
                    is24Hour={true}
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                        dateIcon: {
                            position: 'absolute',
                            left: 0,
                            top: 4,
                            marginLeft: 0
                        },
                        dateInput: {
                            marginLeft: 36
                        }
                    }}
                    onDateChange={(date) => {
                        this.setState({
                            dateEnd:date,
                        });
                    }}
                />
                <Button onPress={this.create.bind(this)} title="Create" />
            </View>
        )
    }
}

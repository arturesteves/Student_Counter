/**
 * Created by Ricardo Morais on 10/06/2017.
 */
import Lesson from '../lib/Lesson';
import React from 'react';
import { BackHandler, View, Text, Picker, TouchableHighlight } from "react-native";
import EntityPicker from "../components/EntityPicker";
import DateTimePicker from 'react-native-modal-datetime-picker';
import Header from "../components/Header";
import ClassLib from "../lib/Class";
import SubjectLib from "../lib/Subject";
import TeacherLIb from "../lib/Teacher";
import Spinner from 'react-native-loading-spinner-overlay';
import {FormLabel, FormInput, Icon, Button, FormValidationMessage} from 'react-native-elements'

export default class LessonEdit extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            dateStart: "",
            dateEnd: "",
            isVisible:false,
            whatDate:-1,
            selectTeacher:0,
            teacherItems:[<Picker.Item key={0} label={"Select Teacher"} value={0} />],
            selectSubject:0,
            subjectItems:[<Picker.Item key={0} label={"Select Subject"} value={0} />],
            isLoading:true
        }
    }

    componentWillMount(){
        BackHandler.addEventListener('hardwareBackPress',()=>{
            this.props.navigation.navigate("Lesson");
            return true;
        });
    }

    static navigationOptions = {
        drawerLabel: undefined,
    };

    update(){
        let that = this;
        if(this.state.selectTeacher == 0 || this.state.selectSubject == 0){
            this.state.selectTeacher == 0 ? alert("You need to choose a teacher") : alert("You need to choose a subject");
            return null
        }
        if(this.state.dateStart=="" || this.state.dateEnd==""){
            alert("Please Insert Both Dates");
            return null;
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

            this.setState({
                isLoading: !this.state.isLoading
            })

            let lesson = that.props.navigation.state.params.lesson;
            lesson.teacherId = that.state.selectTeacher;
            lesson.subjectId = that.state.selectSubject;
            lesson.classes = eligibleClasses;
            lesson.startDate = new Date(this.state.dateStart).toISOString();
            lesson.endDate = new Date(this.state.dateEnd).toISOString();

            lesson.save().then(()=>{
                this.props.navigation.navigate('Lesson');
                this.setState({
                    isLoading: !this.state.isLoading
                })
            }).catch((err) =>{
                console.log(err);
                alert("Something went wrong");
                this.setState({
                    isLoading: !this.state.isLoading
                })
            });
        }).catch((err) =>{
                console.log(err);
                alert("Something went wrong");
                this.setState({
                    isLoading: !this.state.isLoading
                })
        });
    
    }

    _showDateTimePicker = () => this.setState({ isVisible: true });
 
    _hideDateTimePicker = () => this.setState({ isVisible: false });
 
    _handleDatePicked = (date) => {
        let d = new Date(date).toISOString();
        this.state.whatDate == 0 ? this.setState({dateStart:d}) : this.setState({dateEnd:d});
        this.setState({
            whatDate:-1
        })
        this._hideDateTimePicker();
    };

    componentDidMount(){
        this.getTeachers();

        this.getInfo().then();

    }
/////////////////
    async getInfo() {
        let newState = this.state;
        let lesson = this.props.navigation.state.params.lesson;

        newState.selectTeacher = lesson.teacherId;
        newState.selectSubject = lesson.subjectId;
        newState.dateStart = lesson.startDate;
        newState.dateEnd = lesson.endDate;

        this.setState(newState);
    }

    /////
    getTeachers(){
        let eligibleTeachers = [];
        TeacherLIb.all().then((teachers) => {
            if(teachers.length == 0){
                this.setState({
                    isLoading: !this.state.isLoading
                })
                return null;
            }
            SubjectLib.all().then((subjects) => {
                console.log(subjects);
                if(subjects.length == 0){
                    this.setState({
                        isLoading: !this.state.isLoading
                    })
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
                    teacherItems:teacherItems,
                    isLoading: !this.state.isLoading
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
        return(
            <View>
                <Spinner visible={this.state.isLoading} textContent={"Talking to the Database"} textStyle={{color: '#FFF'}} />
                <Header navigate={navigate} text="Edit Lesson"/>
                <FormLabel>Select the teacher:</FormLabel>
                <Picker
                selectedValue={this.state.selectTeacher}
                onValueChange={(itemValue, itemIndex) => {
                    this.setState({selectTeacher: itemValue})
                    this.getTeacherSubjects(itemValue);
                }}>
                {this.state.teacherItems}
                </Picker>
                <FormLabel>Select the subject:</FormLabel>
                <Picker
                selectedValue={this.state.selectSubject}
                onValueChange={(itemValue, itemIndex) => {
                    this.setState({selectSubject: itemValue})
                }}>
                {this.state.subjectItems}
                </Picker>
                <FormLabel>Select lesson start date and time:</FormLabel>
                <TouchableHighlight onPress={() => {this.setState({isVisible:true, whatDate:0})}}>
                    <View style={{flexDirection:"row"}}>
                        <Icon
                        name='clock-o'
                        type="font-awesome"
                        size={30}/>
                        <Text>{this.state.dateStart}</Text>
                    </View>
                </TouchableHighlight>
                <FormLabel>Select lesson end date and time:</FormLabel>
                <TouchableHighlight onPress={() => {this.setState({isVisible:true, whatDate:1})}}>
                    <View style={{flexDirection:"row"}}>
                        <Icon
                        name='clock-o'
                        type="font-awesome"
                        size={30}/>
                        <Text>{this.state.dateEnd}</Text>
                    </View>
                </TouchableHighlight>
                <DateTimePicker
                    value={this.state.dateEnd}
                    isVisible={this.state.isVisible}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}
                    mode={"datetime"}
                />
                <View style={{left: 5, right: 5}}>
                    <Button buttonStyle={{backgroundColor: "black"}} onPress={this.update.bind(this)} title="Update"/>
                </View>
            </View>
        )
    }
}
////////
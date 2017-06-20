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

export default class LessonCreate extends React.Component {

    constructor(props){
        super(props);
        this.state = {
        dateStart: new Date().toISOString(),
        dateEnd: new Date().toISOString(),
        isVisible:false,
        whatDate:-1,
        selectTeacher:0,
        teacherItems:[<Picker.Item key={0} label={"Select Teacher"} value={0} />],
        selectSubject:0,
        subjectItems:[<Picker.Item key={0} label={"Select Subject"} value={0} />],
        isLoading:true
        }
    }

    static navigationOptions = {
        drawerLabel: undefined,
    };

    componentWillMount(){
        BackHandler.addEventListener('hardwareBackPress',()=>{
            this.props.navigation.navigate("Lesson");
            return true;
        });
    }

    create(){
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
            let lesson = new Lesson(that.state.selectTeacher,
                that.state.selectSubject,eligibleClasses,
                new Date(this.state.dateStart).toISOString(),
                new Date(this.state.dateEnd).toISOString());
            
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
    }
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
        let that = this;
        return(
            <View>
                <Spinner visible={this.state.isLoading} textContent={"Talking to the Database"} textStyle={{color: '#FFF'}} />
                <Header navigate={navigate} text="Create Lesson"/>

                <FormLabel>Select the teacher:</FormLabel>
                <Picker style={{marginLeft: 12, marginRight: 4}}
                        selectedValue={this.state.selectTeacher}
                        onValueChange={(itemValue, itemIndex) => {
                            this.setState({selectTeacher: itemValue})
                            this.getTeacherSubjects(itemValue);
                        }}>
                    {this.state.teacherItems}
                </Picker>
                <FormLabel>Select the subject:</FormLabel>
                <Picker style={{marginLeft: 12, marginRight: 4}}
                        selectedValue={this.state.selectSubject}
                        onValueChange={(itemValue, itemIndex) => {
                            this.setState({selectSubject: itemValue})
                        }}>
                    {this.state.subjectItems}
                </Picker>
                <FormLabel>Select lesson start date and time:</FormLabel>

                <TouchableHighlight onPress={() => {this.setState({isVisible:true, whatDate:0})}}>
                    <View style={{flexDirection:"row", marginLeft: 20}}>
                        <Icon
                            name='clock-o'
                            type="font-awesome"
                            size={30}/>
                        <Text style={{marginLeft: 8, marginTop: 5}}>{new Date(this.state.dateStart).toString()}</Text>
                    </View>
                </TouchableHighlight>
                <FormLabel>Select lesson end date and time:</FormLabel>
                <TouchableHighlight onPress={() => {this.setState({isVisible:true, whatDate:1})}}>
                    <View style={{flexDirection:"row", marginLeft: 20}}>
                        <Icon
                            name='clock-o'
                            type="font-awesome"
                            size={30}/>

                        <Text style={{marginLeft: 8, marginTop: 5}}>{new Date(this.state.dateEnd).toString()}</Text>
                    </View>
                </TouchableHighlight>

                <DateTimePicker
                    value={this.state.dateEnd}
                    isVisible={this.state.isVisible}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}
                    mode={"datetime"}
                />

                <View style={{left: 5, right: 5, marginTop: 10}}>
                    <Button buttonStyle={{backgroundColor: "black"}} onPress={this.create.bind(this)} title="Create"/>
                </View>
            </View>
        )
    }
}

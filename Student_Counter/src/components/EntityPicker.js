/**
 * Created by Ricardo Morais on 10/06/2017.
 */

let Class = require("../lib/Class");
let Lesson = require("../lib/Lesson");
let Presence = require("../lib/Presence");
let Student = require("../lib/Student");
let Subject = require("../lib/Subject");
let Teacher = require("../lib/Teacher");

import React from 'react';
import { Picker} from "react-native";


export default class EntityPicker extends React.Component {

    constructor(props){
        super(props);
        this.state = {picker: null};
    }

    componentDidMount(){

        switch(this.props.entity){
            case "class":
                this.createClassPicker().then();
                break;
            case "presence":
                this.createPresencePicker().then();
                break;
            case "student":
                this.createStudentPicker().then();
                break;
            case "subject":
                this.createSubjectPicker().then();
                break;
            case "teacher":
                this.createTeacherPicker().then();
                break;
        }

    }

    //////
    getId(){
        return this.state.id;
    }

    async createClassPicker() {
        let classes = await Class.all();
        if (!classes) {
            return null;
        }
        let newState = {};
        newState.picker = classes.map((t) => <Picker.Item key={t.name} label={t.name} value={t.name}/>);
        this.props.onChange(classes[0].id);
        this.setState(newState);
    }

    async createPresencePicker() {
        let presences = await Presence.all();
        if (!presences) {
            return null;
        }
        let newState = {};
        newState.picker = presences.map((t) => <Picker.Item key={t.id} label={t.name} value={t.id}/>);
        this.props.onChange(presences[0].id);
        this.setState(newState);
    }

    async createStudentPicker() {
        let students = await Student.all();
        if (!students) {
            return null;
        }
        let newState = {};
        newState.picker = students.map((t) => <Picker.Item key={t.number} label={t.name} value={t.number}/>);
        this.props.onChange(students[0].number);
        this.setState(newState);
    }

    async createSubjectPicker() {
        let subjects = await Subject.all();
        if (!subjects) {
            return null;
        }
        let newState = {};
        newState.picker = subjects.map((t) => <Picker.Item key={t.id} label={t.name} value={t.id}/>);
        this.props.onChange(subjects[0].id);
        this.setState(newState);
    }

    async createTeacherPicker() {
        let teachers = await Teacher.all();
        if (!teachers || teachers.length === 0) {
            return null;
        }

        let newState = {};
        newState.picker = teachers.map((t) => <Picker.Item key={t.id} label={t.name} value={t.id}/>);
        this.props.onChange(teachers[0].id);
        this.setState(newState);
    }

    render() {
        return <Picker
            selectedValue={this.state.id}
            onValueChange={(itemValue, itemIndex) => {
                this.setState({
                    id: itemValue,
                    picker: this.state.picker
                });
                if(this.props.onChange) {
                    this.props.onChange(itemValue);
                }
            }}
        >
            {this.state.picker}
        </Picker>
    }

}
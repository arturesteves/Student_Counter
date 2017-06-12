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
import TeacherClass from "../lib/Teacher.js";


export default class EntityPicker extends React.Component {

    constructor(props){
        super(props);
        this.state = {picker: null};
    }

    componentDidMount(){

        switch(this.props.entity){
            case "class":
                break;
            case "presence":

                break;
            case "student":

                break;
            case "subject":

                break;
            case "teacher":
                this.createTeacherPicker().then();
                break;
        }

    }

    getId(){
        return this.state.id;
    }

    async createTeacherPicker() {
        let teachers = await TeacherClass.all();
        if (!teachers) {
            return null;
        }
        let newState = {};
        newState.picker = teachers.map((t) => <Picker.Item key={t.id} label={t.name} value={t.id}/>);
        this.setState(newState);
    }

    render() {
        return <Picker
            selectedValue={this.state.id}
            onValueChange={(itemValue, itemIndex) => {
                this.setState({
                    id: itemValue,
                    picker: this.state.picker
                })
            }}
        >
            {this.state.picker}
        </Picker>
    }
}
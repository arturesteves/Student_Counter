/**
 * Created by Ricardo Morais on 14/06/2017.
 */
import Class from '../lib/Class';
import Student from '../lib/Student';
import Subject from '../lib/Subject';
import Teacher from '../lib/Teacher';
import React from 'react';
import { View,  Button, ScrollView, Dimensions} from "react-native";
import EntityPicker from "../components/EntityPicker";

import { List, ListItem } from 'react-native-elements'

export default class MultiEntityPicker extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            list: {}
        };
    }
    
    create(){

    }

    addEntity() {
        this.props.onAdd(this.state.identifier);
        switch(this.props.entity) {
            case "class":
                this.addClass();
                break;
            case "presence":
                this.addPresence();
                break;
            case "student":
                this.addStudent();
                break;
            case "subject":
                this.addSubject();
                break;
            case "teacher":
                this.addTeacher();
                break;

        }
    }

    //////
    addTeacher() {
        Teacher.retrieve(this.state.identifier).then((teacher)=>{
            this.state.list[this.state.identifier] = {
                title: teacher.name,
                identifier: this.state.identifier
            };
            this.setState(this.state);
        });
    }
    //////
    addStudent() {
        Student.retrieve(this.state.identifier).then((student)=>{
            this.state.list[this.state.identifier] = {
                title: student.name,
                identifier: this.state.identifier
            };
            this.setState(this.state);
        });
    }

    addSubject() {
        Subject.retrieve(this.state.identifier).then((subject)=>{
            this.state.list[this.state.identifier] = {
                title: subject.name,
                identifier: this.state.identifier
            };
            this.setState(this.state);
        });
    }

    render(){
        return(
            <View>
                <EntityPicker entity={this.props.entity} onChange={(identifier)=>{
                    console.log(this.state)
                    this.state.identifier = identifier;
                    this.setState(this.state);
                }} />
                <Button onPress={this.addEntity.bind(this)} title="Add" />
                <List>
                    {
                        Object.keys(this.state.list).map((item, i) => (
                            <ListItem rightIcon={{name: 'delete'}}
                                     onPress={()=>{
                                         this.props.onRemove(item);
                                         let list = this.state.list;
                                         delete list[item];
                                         this.state.list = list;
                                         console.log(this.state.list);
                                         this.setState(this.state);
                                     }}
                                key={i}
                                title={this.state.list[item].title}
                            />
                        ))
                    }
                </List>

            </View>
        )
    }
}

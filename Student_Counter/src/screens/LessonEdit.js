/**
 * Created by Ricardo Morais on 10/06/2017.
 */
import Lesson from '../lib/Lesson';
import React from 'react';
import { View, Text, Button } from "react-native";
import EntityPicker from "../components/EntityPicker";
import DatePicker from 'react-native-datepicker';
import Header from "../components/Header";

export default class LessonEdit extends React.Component {

    constructor(props){
        super(props);
        this.state = {dateStart: "2016-05-09, 1:00 am", dateEnd: "2016-05-09, 1:00 am"}
    }

    static navigationOptions = {
        drawerLabel: undefined,
    };

    onComponentDidMount(){
        let lessonId = this.props.navigation.state.params.lessonId;
        Lesson.retrieve(lessonId).then((lesson)=>{
            this.state.dateStart  = lesson.startDate;
            this.state.dateEnd  = lesson.EndDate;
            this.state.teacherId  = lesson.teacherId;
            this.setState(this.state);
        });
    }

    create(){
        let lesson = new Lesson(this.state.teacherId, this.state.subjectId,
            new Date(this.state.dateStart).toISOString(), new Date(this.state.dateEnd).toISOString());
        lesson.save().then(()=>{
            this.props.navigation.navigate('Lesson');
        });
    }

    render(){
        const { navigate } = this.props.navigation;
        let that = this;
        return(
            <View>
                <Header navigate={navigate} text="Create Lesson"/>
                <Text>Select the teacher:</Text>
                <EntityPicker entity="teacher" onChange={(id)=>{
                    this.state.teacherId = id;
                    this.setState(this.state);
                }} />
                <Text>Select the subject:</Text>
                <EntityPicker entity="subject" onChange={(id)=>{
                    console.log(this.state)
                    this.state.subjectId = id;
                    this.setState(this.state);
                }} />
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
                        this.state.dateStart = date;
                        this.setState(this.state);
                    }}
                />
                <Text>Select lesson end date and time:</Text>

                <DatePicker
                    style={{width: 200}}
                    date={this.state.dateEnd}
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
                        this.state.dateEnd = date;
                        this.setState(this.state);
                    }}
                />

                <Button onPress={this.create.bind(this)} title="Create" />
            </View>
        )
    }
}

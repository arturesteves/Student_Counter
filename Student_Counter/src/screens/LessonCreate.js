/**
 * Created by Ricardo Morais on 10/06/2017.
 */
import Lesson from '../lib/Lesson';
import React from 'react';
import { View, Text, Button } from "react-native";
import EntityPicker from "../components/EntityPicker";
import DatePicker from 'react-native-datepicker';

export default class LessonCreate extends React.Component {

    constructor(props){
        super(props);
        this.state = {date:"2016-05-15"}
    }

    static navigationOptions = {
        drawerLabel: undefined,
    };

    create(){
        console.log(this);
        let lesson = new Lesson(this.state.teacherId, this.state.subjectId, this.state.startDate, this.state.endDate);
        lesson.save().then(()=>{

            // this.props.navigation.navigate('Lesson');
        });
    }

    render(){
        const { navigate } = this.props.navigation.navigate;
        return(
            <View>
                <Text>Select the teacher:</Text>
                <EntityPicker entity="teacher" onChange={(id)=>{
                    this.state.teacherId = id;
                    this.setState(this.state);
                }} />
                <Text>Select the subject:</Text>
                <EntityPicker entity="subject" onChange={(id)=>{
                    this.state.subjectId = id;
                    this.setState(this.state);
                }} />
                <Text>Select lesson start date and time:</Text>
                <DatePicker
                    style={{width: 200}}
                    date={this.state.date}
                    mode="datetime"
                    placeholder="select date"
                    format="YYYY-MM-DD, h:mm a"
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
                    date={this.state.date}
                    mode="datetime"
                    placeholder="select date"
                    format="YYYY-MM-DD, h:mm a"
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

                <Button onPress={this.create} title="Create" />
            </View>
        )
    }
}

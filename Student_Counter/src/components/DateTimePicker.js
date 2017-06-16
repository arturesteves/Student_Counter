import React, {Component} from "react";
import {View, Text} from "react-native";
import DateTimePicker from 'react-native-modal-datetime-picker';
export default class DateTimePicker extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isDateTimePickerVisible: true,
        };
    }
    componentDidMount(){
        this.setState({
            isDateTimePickerVisible:true,
        })
    }
        _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });
        
        _handleDatePicked = (date) => {
            this.props.handleDate(date);
            this._hideDateTimePicker();
        };
    render(){
        return(
            <View>

            </View>
        )
    }
}


import React, {Component} from "react";
import {StyleSheet, View, Text, Image, TouchableHighlight, Alert} from "react-native";
import Styles from "../styles/Styles.js";
import Icons from "../icons/icons.js";
import PresenceLib from "../lib/Presence.js";
import { ListItem } from 'react-native-elements'


//TO MODIFY
export default class MetricItem extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isPresent:false,
            isDelayed: false,
            currentPresence:undefined
        }
    }
    componentDidMount(){
        let that = this;
        PresenceLib.retrieve(this.props.presenceId).then((presence)=>{
            this.setState({
                currentPresence:presence,
                isPresent: presence.present,
                isDelayed: presence.delay
            });
        })

    }

    handlePresence(){
        this.state.currentPresence.updatePresence(!this.state.isPresent);
        this.setState({
            isPresent:!this.state.isPresent
        })
    }

    handleDelay(){
        this.state.currentPresence.updateDelay(!this.state.isDelayed);
        this.setState({
            isDelayed: !this.state.isDelayed
        })
    }

    render(){
        return(
            <ListItem
                style={this.state.isDelayed ? styles.delay : styles.onTime}
                onLongPress={()=>this.handleDelay()}
                key={this.props.number}
                title={this.props.studentName}
                rightIcon={{name: "circle-o", color:this.state.isPresent ? "#008000" : "#FF0000",type:"font-awesome"}}
                onPress={() => this.handlePresence()}
            />
        )
    }
}

let styles = StyleSheet.create({
    delay: {
        backgroundColor: "#f47941"
    },
    onTime: {}
});
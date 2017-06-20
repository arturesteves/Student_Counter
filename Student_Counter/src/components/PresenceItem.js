import React, {Component} from "react";
import {StyleSheet, View, Text, Image, TouchableHighlight, Alert} from "react-native";
import Styles from "../styles/Styles.js";
import Icons from "../icons/icons.js";
import PresenceLib from "../lib/Presence.js";
import {CheckBox, ListItem} from 'react-native-elements'

export default class PresenceItem extends React.Component{
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
            <CheckBox
                title={this.props.studentName + (this.state.isDelayed ? " - delayed" : "")}
                checked={this.state.isPresent}
                onLongPress={()=>this.handleDelay()}
                onPress={() => this.handlePresence()}
            />
            //     <ListItem
            //     style={this.state.isDelayed ? styles.delay : styles.onTime}
            //     onLongPress={()=>this.handleDelay()}
            //     key={this.props.number}
            //     title={this.props.studentName}
            //     rightIcon={{name: "circle-o", color:this.state.isPresent ? "#48b12e" : "#ff4941",type:"font-awesome"}}
            //     onPress={() => this.handlePresence()}
            // />
        )
    }
}

let styles = StyleSheet.create({
    delay: {
        backgroundColor: "#f4613e"
    },
    onTime: {}
});
import React, {Component} from "react";
import {View, Text, Image, TouchableHighlight, Alert} from "react-native";
import Styles from "../styles/Styles.js";
import Icons from "../icons/icons.js";
import PresenceLib from "../lib/Presence.js";
import { ListItem } from 'react-native-elements'

export default class PresenceItem extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isPresent:false,
            presenceId:undefined
        }
    }
    componentDidMount(){
        let that = this;
        this.setState({
            isPresent:that.props.presenceId ? !this.state.isPresent : this.state.isPresent,
            presenceId:that.props.presenceId? that.props.presenceId : undefined
        });
    }

    handlePresence(){
        if(this.state.presenceId){
            alert("Ja existo");
            PresenceLib.retrieve(this.props.presenceId).then((presence)=>{
                presence.updatePresence(!this.state.isPresent);
                this.setState({
                isPresent:!this.state.isPresent
                })               
            })
        }else{
            alert("Não existo");
            let presence = new PresenceLib(this.props.number, this.props.lessonId, true, false);
            presence.save().then((presenceId)=> {
                this.setState({
                    isPresent:true,
                    presenceId: presenceId
                })
            }).catch((err) => console.log(err))
        }
    }

    render(){
        return(
            <ListItem
                key={this.props.number}
                title={this.props.studentName}
                rightIcon={{name: "circle-o", color:this.state.isPresent ? "#008000" : "#FF0000",type:"font-awesome"}}
                onPress={() => this.handlePresence()}
            />
        )
    }
}
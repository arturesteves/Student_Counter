import React, {Component} from "react";
import {StyleSheet, View, Text, Image, TouchableHighlight, Alert} from "react-native";
import Styles from "../styles/Styles.js";
import Icons from "../icons/icons.js";
import Share, {ShareSheet, Button} from 'react-native-share';

export default class Metric extends React.Component{
    constructor(props){
        super(props);
        this.shareOptions = {
            title: "Share Teachelp Metrics",
            message: "Share Teachelp Metrics",
            url: this.props.downloadUrl,
            subject: "Share Teachelp Metrics" //  for email
        };
    }

    metricOnClick(){
        Alert.alert(
            'Metrics',
            'Do you want to download or share the selected metric?',
            [
                {text: 'Download', onPress: () => this.downloadMetric()},
                {text: 'Share', onPress: () => this.shareMetric()},
                {text: 'Close', onDismiss: () => {}},
            ],
            { cancelable: true }
        )
    }

    downloadMetric(){
        alert("Download");
    }

    shareMetric(){
        Share.open(this.shareOptions);
    }

    render(){
        return(
            <TouchableHighlight  underlayColor={"#FFFFFF"} onPress={() => this.metricOnClick()}>
                <View style={Styles.metric}>
                <Image source={Icons.excel} style={{height:30, width:30}}/>
                <Text style={{marginLeft: 15, fontSize:15}}>{this.props.fileName}</Text>
                </View>
            </TouchableHighlight>                       
        )
    }
}
import React, {Component} from "react";
import {StyleSheet, View, Text, Image, TouchableHighlight, Alert} from "react-native";
import Styles from "../styles/Styles.js";
import Icons from "../icons/icons.js";
import Share, {ShareSheet, Button} from 'react-native-share';
import RNFetchBlob from 'react-native-fetch-blob'
import Spinner from 'react-native-loading-spinner-overlay';
const FileOpener = require('react-native-file-opener');

export default class Metric extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isLoadingDownload:false
        }
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
            'Please choose an action for the selected metric?',
            [
                {text: 'Open', onPress: () => this.openMetric()},
                {text: 'Download', onPress: () => this.downloadMetric()},
                {text: 'Share', onPress: () => this.shareMetric()},
            ],
            { cancelable: true }
        )
    }

    downloadMetric(){
        this.setState({
            isLoadingDownload:true
        })
        let dirs = RNFetchBlob.fs.dirs
        let that = this;
        RNFetchBlob.config({
            addAndroidDownloads : {
                useDownloadManager: true,
                notification : true,
                title : that.props.fileName,
                description : "Teachelp Metric Download",
                mime : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                mediaScannable : true,
                path:`${dirs.DownloadDir}/TeachelpMetrics/${that.props.fileName}`
            }
        })
        .fetch('GET', that.props.downloadUrl)
        .then((res) =>{
                that.setState({
                    isLoadingDownload:false
                })
                that.askToOpenMetric()
        }
        )
    }
    openMetric(){
        let dirs = RNFetchBlob.fs.dirs
        let that = this;
        const FilePath = `${dirs.DownloadDir}/TeachelpMetrics/${this.props.fileName}`; // path of the file
        const FileMimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'; // mime type of the file
        FileOpener.open(
            FilePath,
            FileMimeType
        ).then((msg) => {
        },() => {
            RNFetchBlob.fs.exists(FilePath)
            .then((exist) => {
                exist ? that.noAppToOpen() : that.justAsk();
            })
            .catch(() => alert("Someting Went Wrong"))
        });
    }

    askToOpenMetric(){
        Alert.alert(
            'Metrics',
            "Do you want to open the downloaded metric?",
            [
                {text: 'Yes', onPress: () => this.openMetric()},
                {text: 'No', onDismiss: () => {}},
            ],
            { cancelable: true }
        )
    }

    justAsk(){
        Alert.alert(
            'Metrics',
            "The selected metric doesn't exists in the current system. Do you want to download it?",
            [
                {text: 'Yes', onPress: () => this.downloadMetric()},
                {text: 'No', onDismiss: () => {}},
            ],
            { cancelable: true }
        )    
    }

    noAppToOpen(){
        Alert.alert(
            'Metrics',
            "Your current system doesn't have an app to open the current file",
            [
                {text: 'Ok', onDismiss: () => {}},
            ],
            { cancelable: true }
        )   
    }

    shareMetric(){
        Share.open(this.shareOptions);
    }

    render(){
        return(
            <TouchableHighlight  underlayColor={"#FFFFFF"} onPress={() => this.metricOnClick()}>
                <View style={Styles.metric}>
                <Spinner visible={this.state.isLoadingDownload} textContent={"Downloading"} textStyle={{color: '#FFF'}} />
                <Image source={Icons.excel} style={{height:30, width:30}}/>
                <Text style={{marginLeft: 15, fontSize:15}}>{this.props.fileName}</Text>
                </View>
            </TouchableHighlight>                       
        )
    }
}
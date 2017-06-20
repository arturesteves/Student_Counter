import React, {Component} from "react";
import {StyleSheet, View, Text, Image, TouchableHighlight, Alert} from "react-native";
import Styles from "../styles/Styles.js";
import Icons from "../icons/icons.js";
import Share, {ShareSheet, Button} from 'react-native-share';
import RNFetchBlob from 'react-native-fetch-blob'
import Spinner from 'react-native-loading-spinner-overlay';

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
            RNFetchBlob.fs.writeFile(res.path(), 'foo', 'utf8')
              .then(()=>{
                 that.setState({
                    isLoadingDownload:false
                })   
              })   
        }
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
import React, {Component} from "react";
import {View, Text, ScrollView, Dimensions} from "react-native";
import Styles from "../styles/Styles.js";
import Card from "../components/Card"

export default class HomeContent extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            height:0
        }
    }
    
    render(){
        return(
            <View style={Styles.homeContent}>
                <ScrollView height={Dimensions.get("window").height-90} showsVerticalScrollIndicator={false}>
                <View style={Styles.twoCardsInRow}>
                    <Card size="small" icon="lesson" title="Lesson" color="#EF9A9A" navigate={this.props.navigate}/>
                    <Card size="small" icon="subject" title="Subject" color="#90CAF9" navigate={this.props.navigate} />
                </View>
                <View style={Styles.oneCardInRow}>
                    <Card size="big" icon="teacher" title="Teacher" color="#C5E1A5" navigate={this.props.navigate} />
                </View>
                <View style={Styles.twoCardsInRow}>
                    <Card size="small" icon="student" title="Student" color="#FFAB91" navigate={this.props.navigate} />
                    <Card size="small" icon="class" title="Class" color="#9FA8DA" navigate={this.props.navigate} />
                </View>
                <View style={Styles.oneCardInRow}>
                    <Card size="big" icon="metrics" title="Metrics" color="#EF9A9A" navigate={this.props.navigate} />
                </View>
                </ScrollView>
            </View>
        )
    }
}
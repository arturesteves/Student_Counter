import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button,
    Dimensions,
    Image,
    TouchableHighlight,
    ScrollView
} from "react-native";
import { DrawerNavigator } from "react-navigation";
import Header from "../components/Header"
import Styles from "../styles/Styles.js";
import SubjectItem from "../components/SubjectItem.js";


export default class Subject extends React.Component {
    static navigationOptions = {
        drawerLabel: "Subject",
    }
    render(){
        const { navigate } = this.props.navigation;
        return(
            <View>
                <Header navigate={navigate} text="Subject"/>
                <ScrollView height={Dimensions.get("window").height-90} showsVerticalScrollIndicator={false}>
                <View style={Styles.subjectContent}>
                    <SubjectItem name="GP" color="#90CAF9" />
                    <SubjectItem name="DBM" color="#b1d9fa" />
                    <SubjectItem name="IPOO" color="#90CAF9" />
                    <SubjectItem name="POO" color="#b1d9fa" />
                    <SubjectItem name="IA" color="#90CAF9" />
                    <SubjectItem name="DBM" color="#b1d9fa" />
                    <SubjectItem name="IPOO" color="#90CAF9" />
                    <SubjectItem name="POO" color="#b1d9fa" />
                    <SubjectItem name="IA" color="#90CAF9" />
                    <SubjectItem name="DBM" color="#b1d9fa" />
                    <SubjectItem name="IPOO" color="#90CAF9" />
                    <SubjectItem name="POO" color="#b1d9fa" />
                    <SubjectItem name="IA" color="#90CAF9" />
                </View>
                </ScrollView>
            </View>
        )
    }
}
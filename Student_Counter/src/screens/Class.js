import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button,
    Dimensions,
    Image,
    TouchableHighlight,
} from "react-native";
import { DrawerNavigator } from "react-navigation";
import Header from "../components/Header"


export default class Class extends React.Component {
    static navigationOptions = {
        drawerLabel: "Class",
    }
    render(){
        const { navigate } = this.props.navigation;
        return(
            <View>
                <Header navigate={navigate}/>
                <Text>Class Screen</Text>
                <Button onPress={() => this.props.navigation.navigate('ClassCreate')} title="Create new class" />
            </View>
        )
    }
}
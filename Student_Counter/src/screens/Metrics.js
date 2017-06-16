import React from 'react';
import {View, Text, TouchableHighlight} from "react-native";
import Header from "../components/Header"

export default class Metrics extends React.Component {

    constructor(props) {
        super(props);
    }

    static navigationOptions = {
        drawerLabel: "Metrics",
    };
    
    render(){
        const { navigate } = this.props.navigation;
        return(
            <View>
                <Header navigate={navigate} text="Metrics"/>
                <TouchableHighlight onPress={() => alert("Works")}>
                <Text>Metrics</Text>
                </TouchableHighlight>
            </View>
        )
    }
}

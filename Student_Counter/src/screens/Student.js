import React from 'react';
import {
    View,
    Button,

} from "react-native";
import Header from "../components/Header"


export default class Student extends React.Component {

    static navigationOptions = {
        drawerLabel: "Student",
    };

    render(){
        return(
            <View>
                <Header navigate={this.props.navigation}/>
                <Button onPress={() => this.props.navigation.navigate('StudentCreate')} title="Create new student" />
            </View>
        )
    }
}

import React from 'react';
import {View, Text} from "react-native";
import Header from "../components/Header"
import HomeContent from "../components/HomeContent"

export default class Home extends React.Component {

    constructor(props) {
        super(props);
    }

    static navigationOptions = {
        drawerLabel: "Home",
    };

    render(){
        const { navigate } = this.props.navigation;
        return(
            <View>
                <Header navigate={navigate} text="Teachelp"/>
                <HomeContent navigate={navigate} />
            </View>
        )
    }
}

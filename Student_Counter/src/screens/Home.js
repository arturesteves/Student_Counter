import React from 'react';
import {BackHandler, View, Text} from "react-native";
import Header from "../components/Header"
import HomeContent from "../components/HomeContent"
let SharedPreferences = require('react-native-shared-preferences');


export default class Home extends React.Component {

    constructor(props) {
        super(props);

       /* SharedPreferences.getItem("email", function(value){
            //alert("home, email: " + value);
        });*/
    }

    componentWillMount(){
        BackHandler.addEventListener('hardwareBackPress',()=>{
            BackHandler.exitApp();
        });
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

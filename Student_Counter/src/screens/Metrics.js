import React from 'react';
import {
    BackHandler,
    View,
    Text,
    TouchableHighlight,
    PermissionsAndroid 
} from "react-native";
import Header from "../components/Header"
import RNFetchBlob from 'react-native-fetch-blob';
import XLSX from "xlsx";
import MetricsLib from "../lib/metrics"
let SharedPreferences = require('react-native-shared-preferences');


export default class Metrics extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount(){
        BackHandler.addEventListener('hardwareBackPress',()=>{
            this.props.navigation.navigate("Home");
            return true;
        });
    }

    static navigationOptions = {
        drawerLabel: "Metrics",
    };

    componentDidMount() {
    }

    teste() {
        SharedPreferences.getItem("id", function(value){
            if(value){
                const _metrics = new MetricsLib(value);
                _metrics.createMetrics([5]).then((result) => alert("Metrics Created")).catch((err)=>alert(err));
            }
        });
    }      

    render() {
        const {
            navigate
        } = this.props.navigation;
        return ( <View>
            <Header navigate = {
                navigate
            }
            text = "Metrics" / >
            <TouchableHighlight onPress = {() => this.teste()}>
            <Text>Metrics</Text> 
            </TouchableHighlight>
            </View>
        )
    }
}
import React from 'react';
import {
    View,
    Text,
    TouchableHighlight,
    PermissionsAndroid 
} from "react-native";
import Header from "../components/Header"
import RNFetchBlob from 'react-native-fetch-blob';
import XLSX from "xlsx";
import MetricsLib from "../lib/metrics"

export default class Metrics extends React.Component {

    constructor(props) {
        super(props);
    }

    static navigationOptions = {
        drawerLabel: "Metrics",
    };

      componentDidMount() {
  }

    teste() {
        const _metrics = new MetricsLib("-KmnM_fHasrg2GNKe8Kv");
        _metrics.createMetrics([0,3,4]).then((result) => alert("Metrics Created")).catch((err)=>alert(err));      
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
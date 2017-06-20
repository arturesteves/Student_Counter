import React from 'react';
import {
    BackHandler,
    View,
    Text,
    TouchableHighlight,
    PermissionsAndroid,
    ScrollView,
    Dimensions
} from "react-native";
import { CheckBox, Button, Divider } from 'react-native-elements'
import Header from "../components/Header"
import RNFetchBlob from 'react-native-fetch-blob'
import XLSX from "xlsx";
import MetricsLib from "../lib/metricsLib"
import TeacherLib from "../lib/Teacher.js"
import Metric from "../components/Metric"
import Spinner from 'react-native-loading-spinner-overlay';
let SharedPreferences = require('react-native-shared-preferences')


export default class Metrics extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            metrics: undefined,
            metricsToExport:[false,false,false,false,false,false],
            checked:true,
            isLoading:false,
        }
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
        this.setState({
            isLoading:!this.state.isLoading
        })
        let that = this;
        SharedPreferences.getItem("id", function(value){
            TeacherLib.retrieve(value).then((teacher) => {
                let allMetrics = [];
                teacher.metrics.map((metric) => {
                    allMetrics.push(<Metric key={metric.downloadUrl} fileName={metric.fileName} downloadUrl={metric.downloadUrl}/>);
                })
                that.setState({
                    isLoading:!that.state.isLoading,
                    metrics:allMetrics
                })                
            })
        });
    }

    createMetrics() {
        let that = this;
        this.setState({
            isLoading:!this.state.isLoading,
        })
        SharedPreferences.getItem("id", function(value){
            if(value){
                const _metrics = new MetricsLib(value);
                let metricsToExport = [];
                that.state.metricsToExport.map((isToExport, metricNumber) => {
                    if(isToExport){
                        metricsToExport.push(metricNumber);
                    }
                })
                _metrics.createMetrics(metricsToExport).then((result) => {
                    let fileLocation = result[0];
                    let fileName = result[1];
                    let base64 = result[2];
                    TeacherLib.retrieve(value).then((teacher) => {
                        teacher.addTeacherMetrics(base64, fileLocation, fileName).then((result) => {
                            let metrics;
                            if(!that.state.metrics){
                                metrics = [];
                            }else{
                                metrics = that.state.metrics.concat();
                            }
                            metrics.push(<Metric key={result.downloadUrl} fileName={result.fileName} downloadUrl={result.downloadUrl}/>)
                            that.setState({
                                isLoading:!that.state.isLoading,
                                metrics:metrics
                            });
                            alert("Metrics Have Been Created. Location: Downloads/TeachelpMetrics");
                        }) 
                    })
                }).catch((err)=>{
                    alert(err)
                    that.setState({
                                isLoading:!that.state.isLoading,
                    });
                });
            }
        });
    }

    changeMetricToCreate(position){
        let metricsToExport = this.state.metricsToExport;
        metricsToExport[position] = !metricsToExport[position];
        this.setState({
            metricsToExport: metricsToExport
        })
    }

    render() {
        const {
            navigate
        } = this.props.navigation;
        return ( <View>
            
            <Spinner visible={this.state.isLoading} textContent={"Talking to the Database"} textStyle={{color: '#FFF'}} />
            <Header navigate = {navigate} text = "Metrics" />
            <ScrollView style={{marginTop:10}} height={Dimensions.get("window").height-90} showsVerticalScrollIndicator={false}>
            <CheckBox
            title='Classes Metrics'
            checked={this.state.metricsToExport[0]}
            onPress={()=>{this.changeMetricToCreate(0)}}
            />
            <CheckBox
            title='Lessons Metrics'
            checked={this.state.metricsToExport[1]}
            onPress={()=>{this.changeMetricToCreate(1)}}
            />
            <CheckBox
            title='Presences Metrics'
            checked={this.state.metricsToExport[2]}
            onPress={()=>{this.changeMetricToCreate(2)}}
            />
            <CheckBox
            title='Students Metrics'
            checked={this.state.metricsToExport[3]}
            onPress={()=>{this.changeMetricToCreate(3)}}
            />
            <CheckBox
            title='Subjects Metrics'
            checked={this.state.metricsToExport[4]}
            onPress={()=>{this.changeMetricToCreate(4)}}
            />
            <CheckBox
            title='Evaluation Metrics'
            checked={this.state.metricsToExport[5]}
            onPress={()=>{this.changeMetricToCreate(5)}}
            />
            <Button
                title='Create Metrics'
                backgroundColor="black"
                onPress={()=>{this.createMetrics()}}
            />
            <Divider style={{ backgroundColor: 'grey', marginLeft:10, marginRight:10, marginTop:10}} />
            <ScrollView showsVerticalScrollIndicator={true}>
            <View style={{flexDirection:"column"}}>
                {this.state.metrics}
            </View>
            </ScrollView>
            </ScrollView>
            </View>
        )
    }
}
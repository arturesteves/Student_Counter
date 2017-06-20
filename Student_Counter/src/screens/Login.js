import Teacher from '../lib/Teacher';
import React from 'react';
import { BackHandler, View, Text, TextInput, NetInfo } from "react-native";
import Spinner from 'react-native-loading-spinner-overlay';
let SharedPreferences = require('react-native-shared-preferences');
import {FormLabel, FormInput, Button, FormValidationMessage} from 'react-native-elements'

export default class Login extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            email: "",
            password: "",
            ethernetConnection: false,
            isLoading: false
        };
    }

    componentWillMount(){
        BackHandler.addEventListener('hardwareBackPress',()=>{
            this.props.navigation.navigate("Registration");
            return true;
        });
    }

    componentDidMount(){
        NetInfo.isConnected.fetch().then(isConnected => {
            this.setState({ethernetConnection: isConnected});
        });
    }

    static navigationOptions = {
        drawerLabel: undefined,
    };

    /////
    signUp(){
        if(this.state.ethernetConnection){
            let that = this;
            this.saveProperty("isLoading", true);
            Teacher.find(this.state.email, this.state.password).then(function(teacher){
                that.saveProperty("isLoading", false);
                if(teacher) {
                    SharedPreferences.setItem("id", teacher.id);
                    SharedPreferences.setItem("email", teacher.email);
                    that.props.navigation.navigate("Home");
                }else{
                    alert("Wrong username or password!");
                }
            }).catch(function(error){
                that.saveProperty("isLoading", false);
                alert("Error on logging!");
            })
        }else{
            alert("No ethernet connection!");
        }
    }

    saveProperty(property, value){
        let object = {};
        object[property] = value;
        this.setState(object);
    }

    render(){
        const { navigate } = this.props.navigation;

        return(
            <View>
                <Spinner visible={this.state.isLoading} textContent={"Talking to the Database"} textStyle={{color: '#FFF'}} />
                <Text>Teachelp - Sign Up</Text>
                <View>

                    <FormLabel>Email</FormLabel>
                    <FormInput  textInputRef="" placeholder="Please enter your email"
                                onChangeText={(email) => {
                                    this.saveProperty("email", email);
                                }}/>

                    <FormLabel>Password</FormLabel>
                    <FormInput  textInputRef="" placeholder="Please enter your password"
                                secureTextEntry={true}
                                onChangeText={(password) => {
                                    this.saveProperty("password", password);
                                }}/>

                    <Button onPress={this.signUp.bind(this)} title="SIGN IN" />
                </View>
            </View>
        )
    }
}

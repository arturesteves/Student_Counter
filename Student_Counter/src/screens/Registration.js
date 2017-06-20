import Teacher from '../lib/Teacher';
import React from 'react';
import { BackHandler, View, Text, TextInput, NetInfo } from "react-native";
import Spinner from 'react-native-loading-spinner-overlay';
let SharedPreferences = require('react-native-shared-preferences');
import {FormLabel, FormInput, Button, FormValidationMessage} from 'react-native-elements'


export default class Registration extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            id: "",
            email: "",
            name: "",
            password: "",
            isLoading: false,
        };
    }

    componentWillMount(){
        BackHandler.addEventListener('hardwareBackPress',()=>{
            BackHandler.exitApp();
        });
    }

    componentDidMount(){
        //this.logout();
        NetInfo.isConnected.addEventListener( 'change', this.handleFirstConnectivityChange.bind(this) );
    }

    handleFirstConnectivityChange(isConnected){
        if(isConnected){    // connected
            let that = this;
            SharedPreferences.getItem("email", function(value){
                if(value){
                    //alert("Estou logado com, " + value);
                    that.props.navigation.navigate("Home");
                }
            });

            NetInfo.isConnected.removeEventListener( 'change', this.handleFirstConnectivityChange );
        }else{  // not connected
            // -- some action
            alert("No ethernet connection!");
        }
    }


    static navigationOptions = {
        drawerLabel: undefined,
    };

    saveProperty(property, value){
        let object = {};
        object[property] = value;
        this.setState(object);
    }

    signUp(){
        if(this.state.name && this.state.email && this.state.password){
            let that = this;
            this.saveProperty("isLoading", true);
            let teacher = new Teacher(this.state.name, this.state.email, this.state.password);
            teacher.save().then((id) => {
                that.saveProperty("isLoading", false);
                SharedPreferences.setItem("id", id);
                SharedPreferences.setItem("email", this.state.email);

                //notification?
                alert("Teacher created successfully");
                // change screen
                this.props.navigation.navigate("Home");
            }).catch(function(error){
                that.saveProperty("isLoading", false);
                console.log("Error on creating teacher using user interface: ", error.message);
                alert("Failed to create a teacher!");
            });
        }else{
            alert("Some data are missing on form!");
        }
    }

    navigateRegistration(){
        this.props.navigation.navigate("Login")
    }

    render(){
        const { navigate } = this.props.navigation;
        return(
            <View>
                <Spinner visible={this.state.isLoading} textContent={"Talking to the Database"} textStyle={{color: '#FFF'}} />
                <Text>Teachelp - Sign Up</Text>
                <View>

                    <FormLabel>Name</FormLabel>
                    <FormInput  textInputRef="" placeholder="Please enter your name"
                                onChangeText={(name) => {
                                    this.saveProperty("name", name);
                                }}/>

                    <FormLabel>Email</FormLabel>
                    <FormInput  textInputRef="" placeholder="Please enter your email"
                                onChangeText={(email) => {
                                    this.saveProperty("email", email);
                                }}/>

                    <FormLabel>Password</FormLabel>
                    <FormInput  textInputRef="" placeholder="Please enter your Password"
                                onChangeText={(password) => {
                                    this.saveProperty("password", password);
                                }}/>

                    <Button onPress={this.signUp.bind(this)} title="SIGN UP" />
                    <Text onPress={this.navigateRegistration.bind(this)}>Do you have an account? Sign In!</Text>
                </View>
            </View>
        )
    }
}

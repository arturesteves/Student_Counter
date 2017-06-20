import Teacher from '../lib/Teacher';
import React from 'react';
import {ScrollView, ReactNative, BackHandler, View, Text, TextInput, Image, NetInfo, KeyboardAvoidingView} from "react-native";
import Spinner from 'react-native-loading-spinner-overlay';
let SharedPreferences = require('react-native-shared-preferences');
import  { FormLabel, FormInput, Button, FormValidationMessage} from 'react-native-elements'
import Styles from "../styles/Styles.js";
import icons from "../icons/icons.js";
export default class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            ethernetConnection: false,
            isLoading: false
        };
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.navigate("Registration");
            return true;
        });
    }

    componentDidMount() {
        NetInfo.isConnected.fetch().then(isConnected => {
            this.setState({ethernetConnection: isConnected});
        });
    }

    static navigationOptions = {
        drawerLabel: undefined,
    };

    /////
    signUp() {
        if (this.state.ethernetConnection) {
            let that = this;
            this.saveProperty("isLoading", true);
            Teacher.find(this.state.email, this.state.password).then(function (teacher) {
                that.saveProperty("isLoading", false);
                if (teacher) {
                    SharedPreferences.setItem("id", teacher.id);
                    SharedPreferences.setItem("email", teacher.email);
                    that.props.navigation.navigate("Home");
                } else {
                    alert("Wrong username or password!");
                }
            }).catch(function (error) {
                that.saveProperty("isLoading", false);
                alert("Error on logging!");
            })
        } else {
            // alert("No ethernet connection!");
        }
    }

    saveProperty(property, value) {
        let object = {};
        object[property] = value;
        this.setState(object);
    }


    render() {
        const {navigate} = this.props.navigation;

        return (
            <View>
                <Spinner visible={this.state.isLoading} textContent={"Talking to the Database"}
                         textStyle={{color: '#FFF'}}/>
                <View style={{flexDirection: "row", justifyContent: "center"}}>
                    <Image source={icons.main} style={{width: 100, height: 100, marginTop: 50, marginBottom: 50}}/>
                </View>
                <View style={{flexDirection: "row", justifyContent: "center"}}>
                    <Text style={[Styles.headerTitle, {marginLeft: 10}]}>Teachelp - Sign In</Text>
                </View>
                <ScrollView ref='scrollView'>
                    <View>
                        <View style={{flexDirection: "row", justifyContent: "center"}}>
                            <FormLabel>Email</FormLabel>
                        </View>
                        <FormInput style={{marginRight: 60, marginLeft: 60}}
                                   ref='email'
                                   textInputRef="email" placeholder="email"
                                   onChangeText={(email) => {
                                       this.saveProperty("email", email);
                                   }}

                        />
                        <View style={{flexDirection: "row", justifyContent: "center"}}>
                            <FormLabel>Password</FormLabel>
                        </View>

                        <View>
                            <FormInput inputStyle={{alignItems: 'center'}}
                                       style={{marginRight: 60, marginLeft: 60, justifyContent: "center"}}
                                       textInputRef="" placeholder="password"
                                       secureTextEntry={true}
                                       onChangeText={(password) => {
                                           this.saveProperty("password", password);
                                       }}

                            />
                        </View>


                        <View style={{flexDirection: "row", justifyContent: "center"}}>
                            <Button buttonStyle={{width: 200}} backgroundColor="black" onPress={this.signUp.bind(this)}
                                    title="Sign In"/>
                        </View>
                        <View style={{flexDirection: "row", justifyContent: "center"}}>
                            <Text style={{color: "#3366BB", marginTop: 2}} onPress={() => {
                                this.props.navigation.navigate("Registration")
                            }}>
                                Don't have an account? Sign Up!</Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

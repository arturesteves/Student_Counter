import Teacher from '../lib/Teacher';
import React from 'react';
import { View, Text, Button, TextInput, NetInfo } from "react-native";
import Spinner from 'react-native-loading-spinner-overlay';
let SharedPreferences = require('react-native-shared-preferences');

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

    componentDidMount(){
        // TODO: TO REMOVE later
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

    /* TODO: to be placed somewhere else */
    logout (){
        SharedPreferences.clear();  //more drastic
        SharedPreferences.setItem("id", "");
        SharedPreferences.setItem("email", "");
    }

    static navigationOptions = {
        drawerLabel: undefined,
    };

    saveProperty(property, value){
        let object = {};
        object[property] = value;
        this.setState(object);
    }

    signIn(){
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
        //imagem qualquer (logo)
        // fundo claro
        // https://www.google.pt/search?q=login+reactnative+screen&client=firefox-b-ab&source=lnms&tbm=isch&sa=X&ved=0ahUKEwiXyb2N4MPUAhWBwxQKHfXQDjYQ_AUIBigB&biw=1536&bih=731#imgrc=dClHTp0NTgzhZM:
        // support
        // guardar id do prof ? + nome + email
        // get id by email
        return(
            <View>
                <Spinner visible={this.state.isLoading} textContent={"Talking to the Database"} textStyle={{color: '#FFF'}} />
                <Text>Teachelp - Sign </Text>
                <View>
                    <TextInput
                        placeholder="name"
                        onChangeText={(name) => {
                            this.saveProperty("name", name);
                        }}
                        value={this.state.name}
                    />
                    <TextInput
                        placeholder="email"
                        onChangeText={(email) => {
                            this.saveProperty("email", email);
                        }}
                        value={this.state.email}
                    />
                    <TextInput
                        placeholder="password"
                        secureTextEntry={true}
                        onChangeText={(password) => {
                            this.saveProperty("password", password)
                        }}
                        value={this.state.password}
                    />
                    <Button onPress={this.signIn.bind(this)} title="SIGN IN" />
                    <Text onPress={this.navigateRegistration.bind(this)}>Do you have an account? Sing up!</Text>
                </View>
            </View>
        )
    }
}

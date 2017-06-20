import Class from '../lib/Class';
import Student from '../lib/Student';
import React from 'react';
import { BackHandler, View, Text, TextInput, ScrollView, Dimensions } from "react-native";
import MultiEntityPicker from "../components/MultiEntityPicker";
import Header from "../components/Header";
import Spinner from 'react-native-loading-spinner-overlay';
import {FormLabel, FormInput, Button, FormValidationMessage} from 'react-native-elements'

export default class ClassCreate extends React.Component {

    constructor(props){
        super(props);
        this.state = { students: {}, subjects: {}, name:"", isLoading:false };
    }

    componentWillMount(){
        BackHandler.addEventListener('hardwareBackPress',()=>{
            this.props.navigation.navigate("Class");
            return true;
        });
    }

    static navigationOptions = {
        drawerLabel: undefined,
    };

    create(){
        if(this.state.name.length <1 ){
            alert("Please insert the class name");
            return null;
        }
        if(Object.keys(this.state.students).length === 0){
            alert("Please insert students");
            return null;
        }
        if(Object.keys(this.state.subjects).length === 0){
            alert("Please insert subjects");
            return null;
        }
        this.setState({
                isLoading:!this.state.isLoading
            })
        let clazz = new Class(this.state.name, Object.keys(this.state.students), Object.keys(this.state.subjects));
        clazz.save().then(()=> {
            this.setState({
                isLoading:!this.state.isLoading
            })
            this.props.navigation.navigate('Class');
        });
    }

    navigateHome(){
        this.props.navigation.navigate('Home');
    }

    render(){
        const { navigate } = this.props.navigation;
        return(
            <View>
                <Spinner visible={this.state.isLoading} textContent={"Talking to the Database"} textStyle={{color: '#FFF'}} />
                <Header navigate={navigate} text="Create Class"/>

                <ScrollView height={Dimensions.get("window").height-90} showsVerticalScrollIndicator={false}>

                    <FormLabel>Name</FormLabel>
                    <FormInput style={{marginRight: 10}}
                        textInputRef="" placeholder="Please enter the class name"
                                onChangeText={(number) => {
                                    this.state.number = number;
                                    this.setState(this.state);
                                }}/>


                    <FormLabel>Students</FormLabel>
                    <MultiEntityPicker entity="student"
                                       onAdd={(identifier)=>{
                                           this.state.students[identifier] = identifier;
                                           this.setState(this.state);
                                       }}
                                       onRemove={(identifier)=>{
                                           delete this.state.students[identifier];
                                           this.setState(this.state);
                                       }}
                                       />
                    <FormLabel>Subjects</FormLabel>
                    <MultiEntityPicker entity="subject"
                                       onAdd={(identifier)=>{
                                            console.log("Added",identifier)
                                           this.state.subjects[identifier] = identifier;
                                           this.setState(this.state);
                                       }}
                                       onRemove={(identifier)=>{
                                           console.log("Removed",identifier)
                                           delete this.state.subjects[identifier];
                                           this.setState(this.state);
                                       }}
                    />

                    <View style={{left: 5, right: 5}}>
                        <Button buttonStyle={{backgroundColor: "black"}} onPress={this.create.bind(this)} title="Create"/>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

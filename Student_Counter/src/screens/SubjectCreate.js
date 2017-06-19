import Subject from '../lib/Subject';
import Student from '../lib/Student';
import React from 'react';
import { BackHandler, View, Text, TextInput, ScrollView, Dimensions } from "react-native";
import MultiEntityPicker from "../components/MultiEntityPicker";
import Header from "../components/Header";
import Spinner from 'react-native-loading-spinner-overlay';
import {FormLabel, FormInput, Button, FormValidationMessage} from 'react-native-elements'


export default class SubjectCreate extends React.Component {

    constructor(props){
        super(props);
        this.state = { overseers: {}, name:"",acronym:"", isLoading:false};
    }

    componentWillMount(){
        BackHandler.addEventListener('hardwareBackPress',()=>{
            this.props.navigation.navigate("Subject");
            return true;
        });
    }

    static navigationOptions = {
        drawerLabel: undefined,
    };

    create(){
        if(this.state.name.length  < 1){
            alert("You need to add a name");
            return null;
        }
        if(this.state.acronym.length  < 1){
            alert("You need to add a acronym");
            return null;
        }
        if(Object.keys(this.state.overseers).length === 0){
            alert("You need to add a teacher!");
            return null;
        }
        this.setState({
                isLoading:!this.state.isLoading
        })
        let subject = new Subject(this.state.name, this.state.acronym, Object.keys(this.state.overseers));
        subject.save().then(()=> {
            this.props.navigation.navigate('Subject');
            this.setState({
                isLoading:!this.state.isLoading
            })
        });
    }

    render(){
        const { navigate } = this.props.navigation;
        return(
            <View style={{height: Dimensions.get("window").height - 25}}>
                <Header navigate={navigate} text="Create Subject"/>
                <Spinner visible={this.state.isLoading} textContent={"Talking to the Database"} textStyle={{color: '#FFF'}} />

                <ScrollView height={Dimensions.get("window").height-90} showsVerticalScrollIndicator={false}>
                    <FormLabel>Name</FormLabel>
                    <FormInput textInputRef="" placeholder="Please enter the subject name"
                               onChangeText={(name) => {
                                   this.state.name = name;
                                   this.setState(this.name);
                               }}/>

                    <FormLabel>Acronym</FormLabel>
                    <FormInput textInputRef="" placeholder="Please enter the subject acronym"
                               onChangeText={(acronym) => {
                                   this.state.acronym = acronym;
                                   this.setState(this.acronym);
                               }}/>

                    <FormLabel>Teacher</FormLabel>
                    <MultiEntityPicker entity="teacher"
                                       onAdd={(identifier)=>{
                                           this.state.overseers[identifier] = identifier;
                                           this.setState(this.state);
                                       }}
                                       onRemove={(identifier)=>{
                                           delete this.state.overseers[identifier];
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

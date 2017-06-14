import Class from '../lib/Class';
import Student from '../lib/Student';
import React from 'react';
import { View, Text, Button, TextInput, ScrollView, Dimensions } from "react-native";
import MultiEntityPicker from "../components/MultiEntityPicker";
import Header from "../components/Header";

export default class ClassCreate extends React.Component {

    constructor(props){
        super(props);
        this.state = { students: {}, subjects: {} };
    }

    static navigationOptions = {
        drawerLabel: undefined,
    };

    create(){
        let clazz = new Class(this.state.name, Object.keys(this.state.students), Object.keys(this.state.subjects));
        clazz.save().then(()=> {
            this.props.navigation.navigate('Class');
        });
    }

    render(){
        const { navigate } = this.props.navigation;
        return(
            <View>
                <Header navigate={navigate} text="Create Class"/>
                <ScrollView height={Dimensions.get("window").height-90} showsVerticalScrollIndicator={false}>
                    <Text>Insert the name of the class</Text>
                    <TextInput
                        onChangeText={(name) => {
                            this.state.name = name;
                            this.setState(this.state);
                        }}
                        value={this.state.name}
                    />
                    <Text>Students</Text>
                    <MultiEntityPicker entity="student"
                                       onAdd={(identifier)=>{
                                           console.log("Added",identifier)
                                           this.state.students[identifier] = identifier;
                                           this.setState(this.state);
                                       }}
                                       onRemove={(identifier)=>{
                                           console.log("Removed",identifier)
                                           delete this.state.students[identifier];
                                           this.setState(this.state);
                                       }}
                                       />
                    <Text>Subjects</Text>
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

                    <Button onPress={this.create.bind(this)} title="Create" />
                </ScrollView>
            </View>
        )
    }
}

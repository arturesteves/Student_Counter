import React from 'react';
import ClassLib from "../lib/Class.js";
import {StyleSheet, View, Button, Dimensions, ScrollView} from "react-native";
import Header from "../components/Header"
import ClassItem from "../components/ClassItem";

export default class Class extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            items: []
        };
    }
    static navigationOptions = {
        drawerLabel: "Class",
    };

    removeClass(key){
        this.props.navigation.navigate("Class");
    }

    /////
    async componentDidMount(){
        try {

            let that = this;
            let classes = await ClassLib.all();
            console.log("Classes", classes);
            let items = [];
            for(let clazz of classes) {
                let students = clazz.getStudents();
                let countStudents = students.length;
                let subjects = clazz.getSubjects();
                let countSubjects = subjects.length;
                let item = <ClassItem key={clazz.id}
                                      removeClasss={this.removeClass.bind(this)}
                                      id={clazz.id}
                                      clazz={clazz}
                                      countStudents={countStudents}
                                      countSubjects={countSubjects}
                                      navigate={that.props.navigation.navigate}/>;
                items.push(item);
            }

            console.log("Items", items);

            this.setState({items: items})

        } catch(error){
            //todo - do something here
            console.log("ERror", error);
        }
    }


    render(){
        const { navigate } = this.props.navigation;
        return(
            <View>
                <Header navigate={navigate} text="Class"/>
                <ScrollView height={Dimensions.get("window").height-90} showsVerticalScrollIndicator={false}>
                    <Button onPress={() => this.props.navigation.navigate('ClassCreate')} title="Create new class" />
                    <View style={styles.classContent}>
                        {this.state.items}
                    </View>
                </ScrollView>
            </View>
        )
    }
}


let styles = StyleSheet.create({

    classContent: {
        flexWrap: "wrap",
        marginTop: 15,
        marginLeft: 35,
        marginRight: 35,
    }

});
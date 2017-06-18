import React from 'react';
import ClassLib from "../lib/Class.js";
import {BackHandler, StyleSheet, View, Button, Dimensions, ScrollView} from "react-native";
import Header from "../components/Header"
import ClassItem from "../components/ClassItem";
import Spinner from 'react-native-loading-spinner-overlay';

export default class Class extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            classes:undefined,
            isLoading:true
        };
    }
    componentWillMount(){
        BackHandler.addEventListener('hardwareBackPress',()=>{
            this.props.navigation.navigate("Home");
            return true;
        });
    }

    static navigationOptions = {
        drawerLabel: "Class",
    };

    removeClass(key){
        let nClasses = this.state.classes.filter((_class) => _class.key != key);
        this.setState({
            classes: nClasses
        })
    }

    async componentDidMount(){
        try {
            let that = this;
            let classes = await ClassLib.all();
            console.log("Classes", classes);
            let items = [];
            for(let clazz of classes) {
                let countStudents = clazz.studentIds.length;
                let countSubjects = clazz.subjectIds.length;
                let item = <ClassItem key={clazz.name}
                                      removeClass={that.removeClass.bind(that)}
                                      id={clazz.name}
                                      clazz={clazz}
                                      countStudents={countStudents}
                                      countSubjects={countSubjects}
                                      navigate={that.props.navigation.navigate}/>;
                items.push(item);
            }
            console.log("Items", items);
            this.setState({classes: items, isLoading:!this.state.isLoading})
        } catch(error){
            console.log(error);
            alert("Something Went Wrong");
        }
    }


    render(){
        const { navigate } = this.props.navigation;
        return(
            <View>
                <Spinner visible={this.state.isLoading} textContent={"Talking to the Database"} textStyle={{color: '#FFF'}} />
                <Header navigate={navigate} text="Class"/>
                <ScrollView height={Dimensions.get("window").height-90} showsVerticalScrollIndicator={false}>
                    <Button onPress={() => this.props.navigation.navigate('ClassCreate')} title="Create new class" />
                    <View style={styles.classContent}>
                        {this.state.classes}
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
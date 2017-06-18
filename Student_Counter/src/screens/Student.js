import React from "react";
import StudentLib from "../lib/Student.js";
import {BackHandler, StyleSheet, View, Button, Dimensions, ScrollView} from "react-native";
import Header from "../components/Header"
import StudentItem from "../components/StudentItem";
import Spinner from 'react-native-loading-spinner-overlay';


export default class Student extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            items: [],
            isLoading: true,
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

    removeStudent(key){
        this.props.navigation.navigate("Student");
    }
    //////
    /////

    async componentDidMount(){
        await this.createList()
    }

    async createList() {
        this.setState({items: this.state.items, isLoading: true})
        try {
            let that = this;
            let students = await StudentLib.all();
            console.log("Students", students);
            let items = [];
            for(let student of  students) {
                let item = <StudentItem key={student.number}
                                        removeStudent={this.createList.bind(this)}
                                        id={student.number}
                                        student={student}
                                        navigate={that.props.navigation.navigate}/>;
                items.push(item);
            }

            console.log("Items", items);

            this.setState({items: items, isLoading: false})

        } catch(error){
            //todo - do something here
            console.log("ERror", error);
        }
    }
    ///////////
    /////
    /////


    render(){
        const { navigate } = this.props.navigation;
        return(
            <View>
                <Spinner visible={this.state.isLoading} textContent={"Talking to the Database"} textStyle={{color: '#FFF'}} />
                <Header navigate={navigate} text="Students"/>
                <ScrollView height={Dimensions.get("window").height-90} showsVerticalScrollIndicator={false}>
                    <Button onPress={() => this.props.navigation.navigate('StudentCreate')} title="Create new student" />
                    <View style={styles.content}>
                        {this.state.items}
                    </View>
                </ScrollView>
            </View>
        )
    }
}


let styles = StyleSheet.create({

    content: {
        flexWrap: "wrap",
        marginTop: 15,
        marginLeft: 35,
        marginRight: 35,
    }

});


import React from "react";
import StudentLib from "../lib/Student.js";
import {StyleSheet, View, Button, Dimensions, ScrollView} from "react-native";
import Header from "../components/Header"
import StudentItem from "../components/StudentItem";



export default class Student extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            items: []
        };
    }
    static navigationOptions = {
        drawerLabel: "Class",
    };

    removeStudent(key){
        this.props.navigation.navigate("Student");
    }
    //////

    async componentDidMount(){
        try {

            let that = this;
            let students = await StudentLib.all();
            console.log("Students", students);
            let items = [];
            for(let student of  students) {
                let item = <StudentItem key={student.id}
                                      removeStudent={this.removeStudent.bind(this)}
                                      id={student.id}
                                      student={student}
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
    ///////////
    /////


    render(){
        const { navigate } = this.props.navigation;
        return(
            <View>
                <Header navigate={navigate} text="Students"/>
                <ScrollView height={Dimensions.get("window").height-90} showsVerticalScrollIndicator={false}>
                    <Button onPress={() => this.props.navigation.navigate('ClassCreate')} title="Create new class" />
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


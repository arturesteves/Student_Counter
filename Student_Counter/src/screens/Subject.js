import React, {Component} from 'react';
import {
    BackHandler,
    StyleSheet,
    Text,
    View,
    Button,
    Dimensions,
    Image,
    TouchableHighlight,
    ScrollView
} from "react-native";
import { DrawerNavigator } from "react-navigation";
import Header from "../components/Header"
import Styles from "../styles/Styles.js";
import SubjectItem from "../components/SubjectItem.js";
import SubjectLib from "../lib/Subject";
import Spinner from 'react-native-loading-spinner-overlay';
import { Icon } from 'react-native-elements'


export default class Subject extends React.Component {
    static navigationOptions = {
        drawerLabel: "Subject",
    }
    constructor(){
        super();
        this.state = {
            subjects:undefined,
            isLoading:true
        }
    }

    componentWillMount(){
        BackHandler.addEventListener('hardwareBackPress',()=>{
            this.props.navigation.navigate("Home");
            return true;
        });
    }

    componentDidMount(){
        this.getSubjects();
    }
    removeSubject(key){
        let nSubjects = this.state.subjects.filter((subject) => subject.key != key);
        this.setState({
            subjects: nSubjects
        })
    }

    getSubjects(){
        let that = this;
        SubjectLib.all().then((subjects) => {
            let color = 1;
            let subjs = subjects.map(function(subject){
                color == 1 ? color=0 : color=1;
                return <SubjectItem navigate={that.props.navigation.navigate} key={subject.id} id={subject.id} subject={subject} removeSubject={that.removeSubject.bind(that)} name={subject.acronym} color={color == 0 ? "#90CAF9" : "#b1d9fa"} />
            })
            this.setState({
                subjects:subjs,
                isLoading:!this.state.isLoading
            })
        })
    }
    render(){
        const { navigate } = this.props.navigation;
        return(
            <View>
                <Spinner visible={this.state.isLoading} textContent={"Talking to the Database"} textStyle={{color: '#FFF'}} />
                <Header navigate={navigate} text="Subject"/>
                <ScrollView height={Dimensions.get("window").height-90} showsVerticalScrollIndicator={false}>
                <View style={Styles.subjectContent}>
                {this.state.subjects}
                </View>
                </ScrollView>
                <View style={styles.add}>
                    <Icon
                        reverse
                        name='plus'
                        type = "font-awesome"
                        color='#000'
                        onPress={() => this.props.navigation.navigate('SubjectCreate')}
                    />
                </View>
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
    },
    add: {
        position: 'absolute',
        right:     4,
        bottom:      4,
    }


});


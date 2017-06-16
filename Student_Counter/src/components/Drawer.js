import React from "react";
import {
    View,
} from "react-native";
import DrawerHeader from "./DrawerHeader";
import DrawerContent from "./DrawerContent";
import Styles from "../styles/Styles.js";

export default class Drawer extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <View style={Styles.drawer}>
                <DrawerHeader navigate={this.props.navigate} />
                <DrawerContent navigate={this.props.navigate}/>
            </View>
        )
    }
}
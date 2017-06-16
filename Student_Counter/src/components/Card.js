import React, {Component} from "react";
import {View, Text, TouchableHighlight, Image} from "react-native";
import Styles from "../styles/Styles.js";
import icons from "../icons/icons.js";

export default class Card extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return(
            <View>
                <TouchableHighlight
                    underlayColor={""+this.props.color}
                    style={[this.props.size === "small" ? Styles.smallCard : Styles.bigCard, {backgroundColor: this.props.color}]}
                    onPress={()=>this.props.navigate(this.props.title)}>
                    <View style={Styles.cardInner}>
                        <Image source={icons[this.props.icon]} style={Styles.cardImage}/>
                        <Text style={Styles.cardTitle}>{this.props.title}</Text>
                    </View>
                </TouchableHighlight>
            </View>
        )
    }
}


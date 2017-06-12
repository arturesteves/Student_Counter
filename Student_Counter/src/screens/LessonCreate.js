/**
 * Created by Ricardo Morais on 10/06/2017.
 */
import React from 'react';
import { View, Text } from "react-native";
import EntityPicker from "../components/EntityPicker";

export default class LessonCreate extends React.Component {

    static navigationOptions = {
        drawerLabel: undefined,
    };

    render(){
        const { navigate } = this.props.navigation.navigate;
        return(
            <View>
                <Text>Select the teacher:</Text>
                <EntityPicker entity="teacher"/>
            </View>
        )
    }
}

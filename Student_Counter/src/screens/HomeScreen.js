import React, {Component} from 'react';
import {Button, View, Dimensions, ScrollView, Text} from 'react-native';

export default class HomeScreen extends React.Component{
  constructor(){
    super();
    this.state = {
      appFunc:['Create Student', 'Create Class', 'Create Lesson']
    }
  }

  render(){
    let functButtons = this.state.appFunc.map(function(title){
      return (
        <View style={{margin:10}}>
          <Button
          title={title}
          style={{width:50, margin:50}}
          />
        </View>
      )
    });

    var width = Dimensions.get('window').width;
    var height = Dimensions.get('window').height;

    return (
      <View style={{flex:1, flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
        <View style={{flex:0.1, flexDirection:"column",justifyContent:"center", alignItems:"center", backgroundColor:"white", width: width, height: 10, marginBottom:20}}>
          <Text style={{fontWeight:'bold'}}>Student Counter</Text>
        </View>
        <ScrollView>
                {functButtons}
        </ScrollView>
      </View>
    );
  }
}

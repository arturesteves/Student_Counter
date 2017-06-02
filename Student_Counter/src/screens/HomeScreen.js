import React, {Component} from 'react';
import {Icon, Button} from 'react-native-elements'
import {View, Dimensions, ScrollView, Text, ToolbarAndroid} from 'react-native';

export default class HomeScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      appFunc: [
        {
          id:1,
          title: 'Create Student',
          icon: 'school'
        }, {
          id:2,
          title: 'Create Class',
          icon: 'Class'
        }, {
          id:3,
          title: 'Create Lesson',
          icon: 'alarm'
        }
      ]
    }
  }

  render() {
    let functButtons = this.state.appFunc.map(function(obj) {
      return (
        <Button
        key={obj.id}
        borderRadius={5}
        raised large
        iconRight
        containerViewStyle={styles.buttonContainer}
        icon={{name: obj.icon}}
        title={obj.title}
        backgroundColor='orange'/>
      )
    });

    return (
      <View style={styles.viewStyle}>
        <View style={styles.toolbar}>
          <Icon name="menu" type='simple-line-icon'/>
          <Text style={styles.toolText}>Student Counter</Text>
          <Icon name="search" tye='evilicon'/>
        </View>
        <ScrollView>
          {functButtons}
        </ScrollView>
      </View>
    );
  }
}

var width = Dimensions.get('window').width;

var styles = {
  buttonContainer: {
    margin: 10,
    width: width - 30
  },
  viewStyle: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  toolbar: {
    flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: 'orange'
  },
  toolText:{
    color:'white',
    marginTop: 11,
    fontWeight: 'bold',
    fontSize: 20
  }
}

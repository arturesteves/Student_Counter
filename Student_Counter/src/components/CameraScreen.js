import React, {Component} from 'react';
import {AppRegistry, StyleSheet, Text, View, Dimensions} from 'react-native';
import Camera from 'react-native-camera';
import * as firebase from 'firebase';
import RNFetchBlob from 'react-native-fetch-blob';

export default class CameraScreen extends Component {
  constructor() {
    super();
    this.state = {
      options: {
        captureTarget: Camera.constants.CaptureTarget.disk
      }
    };
  }

  takePicture() {
    this.camera.capture({metadata: this.state.options}).then((data) => {
      console.log(data.path);
      /*Como passar os diretorios das imagens*/
      this.saveOnFirebase('/Student/140221061/profile_pic.jpg', data.path);
    }).catch(err => console.error(err));
  }

  saveOnFirebase(storagePath, uri) {

    const polyfill = RNFetchBlob.polyfill

    window.XMLHttpRequest = polyfill.XMLHttpRequest
    window.Blob = polyfill.Blob

    RNFetchBlob.fs.readFile(uri, 'base64').then((data) => {
      console.log(data);
      var metadata = {
        contentType: 'image/jpeg'
      };

      Blob.build(RNFetchBlob.wrap(uri), {type : 'image/jpeg'}).then((blob) => {
        let storageRef = firebase.storage().ref('images');
        let testImagesRef = storageRef.child(storagePath);
        var uploadTask = testImagesRef.put(blob, metadata).then((snapshot) => {/*Working*/});
      }).catch((err) => console.log(err));
    }).catch((err) => console.log(err));
  }

  render() {
    return <Camera ref={(cam) => {
      this.camera = cam;
    }} style={styles.preview} aspect={Camera.constants.Aspect.fill}>
      <Text style={styles.capture} onPress={this.takePicture.bind(this)}>[CAPTURE]</Text>
    </Camera>

  }
}

const styles = StyleSheet.create({
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  capture: {
    flex: 0,
    backgroundColor: '#ff8d3f',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  }
});

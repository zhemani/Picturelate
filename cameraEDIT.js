import React, {Component} from 'react';
import {StyleSheet, Text, View, TextInput, Button,  FlatList} from 'react-native';
import { createAppContainer, createStackNavigator, StackActions, NavigationActions } from 'react-navigation';
import { TouchableOpacity } from 'react-native';
import { Camera, Permissions } from 'expo';
import axios from 'axios';
import Home from './App.js'
import Styling from './style';

const serverUrl = 'https://hackwestern5-api-heroku.herokuapp.com';
const http = axios.create({
  baseURL: serverUrl,
});

export class CameraExample extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }
}
takePicture() {
    this.setState({
        takeImageText: "... PROCESSING PICTURE ..."
    });
    this.camera.takePictureAsync({ skipProcessing: true, base64: true }).then((data) => {
        http.post('/picture',
    data.base64
  )
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
        this.setState({
            takeImageText: "PICTURE TAKEN",
            photo: data.uri
        }, console.log(data.uri))
    })
}


  render() {

    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } 
    else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
    else {
      return (
        <View style = {{ flex: 1}}>
        <Camera
        style = {{flex: 1}}
        ref={ref => { this.camera = ref; }}
        type={this.state.type} >
               
        <View style={{
            flex: 1,
            backgroundColor: 'transparent',
            flexDirection: 'row',
        }}>
               <TouchableOpacity style={{
                  flex: 0.1,
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                }}
               onPress={this.takePicture.bind(this)} >
               <Text>Tsdfdfs</Text>
               <Text>Take photdfsdfsdfso</Text>
               <Text>Take phdfsdfdfdsfoto</Text>
               <Text>Take photo</Text>
           </TouchableOpacity>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View style={styles.toolbar}>
      <TouchableOpacity>
      <Button onPress={() => {
            this.props.navigation.dispatch(StackActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({ routeName: 'Home' })
              ],
            }))
          }} 
             style={styles.backButton}
             title="BACK "
     /></TouchableOpacity></View>
      </View>
 
    </Camera>
 
 </View>

   
    
      );}
              }}


var styles = StyleSheet.create({
    toolbar:{
        paddingTop:1,
        paddingBottom:1,
        flexDirection:'row'    //Step 1
    },
    backButton:{
        width: 150,            //Step 2
        color:'#fff',
        textAlign:'center'
    },
});


import React, {Component} from 'react';
import {StyleSheet, Text, View, TextInput, Button, FlatList} from 'react-native';
import { createAppContainer, createStackNavigator, StackActions, NavigationActions } from 'react-navigation';
import { TouchableOpacity } from 'react-native';
import { Camera, Permissions } from 'expo';
import axios from 'axios';
import Home from './App.js';
import Icon from 'react-native-vector-icons/FontAwesome';

var languages;
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
takePicture() {
    this.setState({
    });
    this.camera.takePictureAsync({ skipProcessing: true, base64: true}).then((data) => {
        var self = this;
        http.post('/picture',
    data.base64
  )
  .then(function (response) {
    //console.log(response.request['_response']);
    languages = (JSON.parse(response.request['_response']));
    var arr = [];

    Object.keys(languages).forEach(function(item) {
    arr.push(languages[item]);
})
            console.log(arr)
    self.setState({takeImageText: arr, isShowingText: true})
  })
  .catch(function (error) {
    console.log(error);
  });
        this.setState({
            photo: data.uri
        }, console.log(data.uri))
    })
}

getSpeech = (key) => {
    http.post('/speech', key).then(function (response) { console.log(response); 

                                                        
                                                       }).catch(function (error) { console.log(error);})
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
     /></TouchableOpacity>
          
          
         
        <Camera
        style = {{flex: 1}}
        ref={ref => { this.camera = ref; }}
        type={this.state.type} >
        <View>
            {this.state.takeImageText != null ?  this.state.takeImageText.map((key, value) => <TouchableOpacity style={styles.langaugeButton} onPress={() => this.getSpeech(key.text)
            
            
            
            
            
            
            
            }><Text style = {{fontFamily: 'Avenir-Black', fontSize: 20}}> {key.orig} translates to {key.text}</Text></TouchableOpacity>) : null }
        </View>
                
        
                
                
            
                
        <View style={{
            flex: 1,
            backgroundColor: 'transparent',
            flexDirection: 'row',
        }}>
               
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View style={styles.toolbar}>
</View>
      </View>
      
      <TouchableOpacity style={{
                  flex: .3,
                  alignItems: 'center',
                padding: 10,
                    
       
          
                }}
                onPress={this.takePicture.bind(this) }>
              
               <Text style = { { fontFamily: 'Avenir-Black', fontSize: 20}}>Take photo</Text>
           </TouchableOpacity>
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
        width: 20,//Step 2
        color:'#fff',
        justifyContent: 'flex-start'
        
    },
    container: {
    marginBottom: 50,
    marginLeft: 30,
    marginRight: 30,
    //backgroundcolor: '#28B483',
  },
    langaugeButton: {
        alignItems: 'center',
        backgroundColor: '#D3D3D355',
        padding: 10,

}});


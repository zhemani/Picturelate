import React, {Component} from 'react';
import {StyleSheet, Text, View, TextInput, Button,  FlatList} from 'react-native';
import { createAppContainer, createStackNavigator, StackActions, NavigationActions } from 'react-navigation';
import axios from 'axios';
//import {Details} from './camera.js'
import {CameraExample} from './camera.js'

const serverUrl = 'https://hackwestern5-api-heroku.herokuapp.com';
const http = axios.create({
  baseURL: serverUrl,
});
class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
      input: '',
      message: [],
    };
  }



sendTo(language){
    http.post('/test', {
    'language': language,
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
  this.props.navigation.dispatch(StackActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({ routeName: 'CameraExample', params:{lang: language} })
              ],
            }))
          }

render(){
  return (
    <View>
      <View style={styles.toolbar}>
      </View>
        <View style={styles.bodyStyle}>     
      <Button title='French' style={styles.elementStyle} onPress={() => this.sendTo("fr")} />
      <Button title='Spanish' onPress={() => this.sendTo("es")}/>
      <Button title='Russian' onPress={() => this.sendTo("ru")}/>
      <Button title='Mandarin' onPress={() => this.sendTo("cmn")}/>
      <Button title='Japanese' onPress={() => this.sendTo("ja")}/>
      <Button title='Hindi' onPress={() => this.sendTo("hi")}/>
    </View>
  </View>
  )
}

}


var styles = StyleSheet.create({
    toolbar:{
        paddingTop:10,
        paddingBottom:10,
        flexDirection:'row'    //Step 1
    },
    backButton:{
        width: 150,            //Step 2
        color:'#fff',
        textAlign:'center'
    },
   bodyStyle:{
       backgroundColor: '#fff',
       color: '#fff',
       paddingTop: 20,
       paddingBottom: 20, 
   },
   elementStyle:{
     paddingTop: 20,
     paddingBottom: 30,
   },
});

const AppNavigator = createStackNavigator({
  Home: {
    screen: Home,
  },
  // Details: {
  //   screen: Details,
  // },
  CameraExample:{
    screen: CameraExample,
  },
}, {
    initialRouteName: 'Home',
});

export default createAppContainer(AppNavigator);

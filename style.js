import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, Icon } from 'react-native';

const styles = StyleSheet.create({
  container: {
    marginBottom: 50,
    marginLeft: 30,
    marginRight: 30,
    //backgroundcolor: '#28B483',
  },
  firsttext: {
    margin: 5, 
    color: 'black'
  },
  captureContainer: {
    position: 'absolute',
    bottom: 0,

  } 
});

export default class Styling extends Component {
  render() {
    return (

      <View style= { styles.container }>
      <Text style= { styles.firsttext }>Go Back</Text> 
       <View style= { styles.captureContainer }>
       <Icon style={styles.iconCamera}>camera</Icon>
       </View> 
       </View>
    );
  }
}


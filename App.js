import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import HomeScreen from './screens/HomeScreen';

export default class App extends Component {

  render() {
    return (
        <View style={styles.container}>
          <HomeScreen></HomeScreen>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

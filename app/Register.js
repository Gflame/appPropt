import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
//import Button from 'react-native-button';
import { Actions } from 'react-native-router-flux';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

const Register = () => (
  <View style={styles.container}>
    <Text>Register page</Text>
    <Button onPress={()=>Actions.register2()}>Register2</Button>
    <Button onPress={Actions.home}>Replace screen</Button>
    <Button onPress={Actions.pop}>Back</Button>
  </View>
);

export default Register;

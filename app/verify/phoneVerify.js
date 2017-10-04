import React, {Component} from 'react';
import {
    Modal,
    AppRegistry,
    AsyncStorage,
    PickerIOS,
    NSLocationWhenInUseUsageDescription,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Platform,
    Button,
    Alert
} from 'react-native';
import styles from "./../styles";

import Frisbee from 'frisbee';


import PhoneInput from 'react-native-phone-input';
import ModalPickerImage from './../ModalPickerImage'

const api = new Frisbee({
    baseURI: 'https://dev4-cas.searchrisk.com/cas/',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

const MAX_LENGTH_NUMBER = 20;

class phoneVerify extends React.Component {
    static navigationOptions = {
        title: 'Automobile',
        headerTintColor: 'white',
        headerTitleStyle: {
            color: '#fff',

        },
        headerStyle: {
            backgroundColor: 'red'
        },
    };


    _getCode = () => {


        const number = this.refs.phone.getValue();

        const phoneNumber = number;
        this.setState({spinner: true});


        console.log(number)
        setTimeout(async() => {

            try {
                const res = await api.post('smsLoginCode', {
                    body: {
                        phoneNumber
                    }
                });
                if (res.err) throw res.err;


                const user_object = {
                    phone: phoneNumber,
                    verifyID: res.body.data.verificationID,
                    verifyCode: '',
                };


                AsyncStorage.setItem('store_user', JSON.stringify(user_object), () => {
                    AsyncStorage.mergeItem('user_object', JSON.stringify(user_object), () => {
                        AsyncStorage.getItem('user_object', (err, result) => {
                            console.log(result);
                        });
                    });
                });


                this.setState({
                    spinner: false,
                    enterCode: true,
                    verification: res.body
                });


                this.refs.form.refs.textInput.setNativeProps({text: ''});

                setTimeout(() => {
                    Alert.alert('Sent!', "We've sent you a verification code", [{
                        text: 'OK',
                        onPress: () => this.refs.form.refs.textInput.focus()
                    }]);
                }, 100);

            }
            catch (err) {
                this.setState({spinner: false});
                setTimeout(() => {
                    Alert.alert('Oops!', err.message);
                }, 100);
            }

        }, 100);

    }


    render() {
        return (

            <View style={styles.container}>
                <PhoneInput
                    ref='phone'
                    onPressFlag={this.onPressFlag}
                />

                <ModalPickerImage
                    ref='myCountryPicker'
                    data={this.state.pickerData}
                    onChange={(country)=> {
                        this.selectCountry(country)
                    }}
                    cancelText='Cancel'/>
            </View>
        );
    }
}

module.exports = phoneVerify;
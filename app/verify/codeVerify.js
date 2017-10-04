

import React, { Component } from 'react';

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



import Frisbee from 'frisbee';
import Spinner from 'react-native-loading-spinner-overlay';
import Form from 'react-native-form';

import PhoneInput from 'react-native-phone-input';
import ModalPickerImage from './app/ModalPickerImage'

export default class App extends Component {

}

const MAX_LENGTH_CODE = 6;


import React from "react";

import { AppRegistry } from "react-native";

import { Root } from "native-base";

import { StackNavigator } from "react-navigation";

//import PhoneVerify from "./screen/authentication/PhoneVerify";

import Home from "./components/Home/";

import {Scene, Router} from 'react-native-router-flux';
class App extends React.Component {
    render() {
        return (
            <Router>
                <Scene key="root">
                    <Scene key="login" component={Login} title="Login"/>
                    <Scene key="register" component={Register} title="Register"/>
                    <Scene key="home" component={Home}/>
                </Scene>
            </Router>
        );
    }
}

module.exports = App;

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

import {
    Scene,
    Router,
    Actions,
    Reducer,
    ActionConst,
} from 'react-native-router-flux';

import Frisbee from 'frisbee';
import Spinner from 'react-native-loading-spinner-overlay';
import Form from 'react-native-form';

import PhoneInput from 'react-native-phone-input';
import ModalPickerImage from './app/ModalPickerImage'

const api = new Frisbee({
    baseURI: 'https://dev4-cas.searchrisk.com/cas/',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

const MAX_LENGTH_CODE = 6;
const MAX_LENGTH_NUMBER = 20;

// if you want to customize the country picker
const countryPickerCustomStyles = {};

// your brand's theme primary color
const brandColor = '#744BAC';

const styles = StyleSheet.create({
    countryPicker: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        flex: 1,
        backgroundColor: '#333'
    },
    header: {
        textAlign: 'center',
        marginTop: 60,
        fontSize: 22,
        margin: 20,
        color: '#4A4A4A',
    },
    form: {
        margin: 20
    },
    textInput: {
        padding: 0,
        margin: 0,
        flex: 1,
        fontSize: 20,
        color: brandColor
    },
    button: {
        marginTop: 20,
        height: 50,
        backgroundColor: brandColor,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontFamily: 'Helvetica',
        fontSize: 16,
        fontWeight: 'bold'
    },
    wrongNumberText: {
        margin: 10,
        fontSize: 14,
        textAlign: 'center'
    },
    disclaimerText: {
        marginTop: 30,
        fontSize: 12,
        color: 'grey'
    },
    callingCodeView: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    callingCodeText: {
        fontSize: 20,
        color: brandColor,
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
        paddingRight: 10
    }
});





let user_object = {
    phone: '',
    verifyID: '',
    verifyCode: '',
};

AsyncStorage.setItem('store_user', JSON.stringify(user_object), () => {
    AsyncStorage.getItem('store_user', (err, result) => {
        console.log(result);

    });
});



export default class example extends Component {

    constructor(props) {
        super(props);
        this.state = {
            enterCode: false,
            spinner: false,
            country: {
                cca2: 'BG',
                callingCode: '+359'
            }




        };
        this.onPressFlag = this.onPressFlag.bind(this)
        this.selectCountry = this.selectCountry.bind(this)
        this.state = {
            pickerData: null
        }


    }



    _getCode = () => {
        const number = this.refs.phone.getValue();

        const phoneNumber = number;
        this.setState({ spinner: true });



        setTimeout( async () => {

            try {
                const res = await api.post('smsLoginCode', {
                    body: {
                        phoneNumber
                    }
                });
                if (res.err) throw res.err;





                AsyncStorage.getItem('store_user', (err, user) => {
                    let parsedUser = JSON.parse(user);

                    parsedUser.phone = phoneNumber;
                    parsedUser.verifyID = res.body.data.verificationID;

                    AsyncStorage.setItem('store_user', JSON.stringify(parsedUser), () => {
                        AsyncStorage.getItem('store_user', (err, result) => {
                                    console.log(result);
                                });
                    });
                });


                this.setState({
                    spinner: false,
                    enterCode: true,
                    verification: res.body
                });



                this.refs.form.refs.textInput.setNativeProps({ text: '' });

                setTimeout(() => {
                    Alert.alert('Sent!', "We've sent you a verification code", [{
                        text: 'OK',
                        onPress: () => this.refs.form.refs.textInput.focus()
                    }]);
                }, 100);

            }
            catch (err) {
                this.setState({ spinner: false });
                setTimeout(() => {
                    Alert.alert('Oops!', err.message);
                }, 100);
            }

        }, 100);

    }



    _verifyCode = () => {

        const data = this.refs.form.getValues();

        AsyncStorage.getItem('store_user', (err, user) => {
            let parsedUser = JSON.parse(user);

            parsedUser.verifyCode = data.code;

            setTimeout(async () => {
            try {
                const res = await api.post('sms_login_code/login', {
                    body: {
                        verificationId: parsedUser.verifyID,
                        verificationCode: parsedUser.verifyCode,
                        userPhone: parsedUser.phone
                    }
                });
                console.log(res);
                if (res.err) throw res.err;
                this.refs.form.refs.textInput.blur();
                // <https://github.com/niftylettuce/react-native-loading-spinner-overlay/issues/30#issuecomment-276845098>
                this.setState({ spinner: false });
                setTimeout(() => {
                    Alert.alert('Success!', 'You have successfully verified your phone number');
                }, 100);

            } catch (err) {
                // <https://github.com/niftylettuce/react-native-loading-spinner-overlay/issues/30#issuecomment-276845098>
                this.setState({ spinner: false });
                setTimeout(() => {
                    Alert.alert('Oops!', err.message);
                }, 100);
            }
            }, 100);


        });





    }

    _onChangeText = (val) => {
        if (!this.state.enterCode) return;
        if (val.length === MAX_LENGTH_CODE)
            this._verifyCode();
    }

    _tryAgain = () => {
        this.refs.form.refs.textInput.setNativeProps({ text: '' })
        this.refs.form.refs.textInput.focus();
        this.setState({ enterCode: false });
    }

    _getSubmitAction = () => {
        this.state.enterCode ? this._verifyCode() : this._getCode();
    }

    _changeCountry = (country) => {
        this.setState({ country });
        this.refs.form.refs.textInput.focus();
    }

    _renderFooter = () => {

        if (this.state.enterCode)
            return (
                <View>
                    <Text style={styles.wrongNumberText} onPress={this._tryAgain}>
                        Enter the wrong number or need a new code?
                    </Text>
                </View>
            );

        return (
            <View>
                <Text style={styles.disclaimerText}>By tapping "Send confirmation code" above, we will send you an SMS to confirm your phone number. Message &amp; data rates may apply.</Text>
            </View>
        );

    }

    _renderCountryPicker = () => {

        if (this.state.enterCode)
            return (
                <View />
            );

        return (


        <View style={styles.container}>
            <PhoneInput
                ref='phone'
                onPressFlag={this.onPressFlag}
            />

            <ModalPickerImage
                ref='myCountryPicker'
                data={this.state.pickerData}
                onChange={(country)=>{ this.selectCountry(country) }}
                cancelText='Cancel'
            />
        </View>


            // <CountryPicker
            //     ref={'countryPicker'}
            //     closeable
            //     style={styles.countryPicker}
            //     onChange={this._changeCountry}
            //     cca2={this.state.country.cca2}
            //     styles={countryPickerCustomStyles}
            //     translation='eng'/>
        );

    }


    _renderCodeInput = () => {

        if (this.state.enterCode)
            return (
                <View />
            );

        return (


            <View style={styles.container}>
                <PhoneInput
                    ref='phone'
                    onPressFlag={this.onPressFlag}
                />

                <ModalPickerImage
                    ref='myCountryPicker'
                    data={this.state.pickerData}
                    onChange={(country)=>{ this.selectCountry(country) }}
                    cancelText='Cancel'
                />
            </View>



        );

    }





    componentDidMount(){
        this.setState({
            pickerData: this.refs.phone.getPickerData()
        })
    }

    onPressFlag(){
        this.refs.myCountryPicker.open()
    }

    selectCountry(country){
        this.refs.phone.selectCountry(country.iso2)
    }

    render() {



        let headerText = `What's your ${this.state.enterCode ? 'verification code' : 'phone number'}?`
        let buttonText = this.state.enterCode ? 'Verify confirmation code' : 'Send confirmation code';
        let textStyle = this.state.enterCode ? {
            height: 50,
            textAlign: 'center',
            fontSize: 40,
            fontWeight: 'bold',
            fontFamily: 'Courier'
        } : {};






        return (


        <Router>
            <Scene key="root">
                <Scene key="login" component={Login} title="Login"/>
                <Scene key="register" component={Register} title="Register"/>
                <Scene key="home" component={Home}/>
            </Scene>
        </Router>

            <View style={styles.container}>

                <Text style={styles.header}>{headerText}</Text>

                <Form ref={'form'} style={styles.form}>

                    <View style={{ flexDirection: 'row' }}>


                        {this._renderCountryPicker()}
                        {/*{this._renderCallingCode()}*/}

                        <TextInput
                            ref={'textInput'}
                            name={this.state.enterCode ? 'code' : '' }
                            type={'TextInput'}
                            underlineColorAndroid={'transparent'}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            onChangeText={this._onChangeText}
                            placeholder={this.state.enterCode ? '_ _ _ _ _ _' : ' '}
                            keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                            style={[ styles.textInput, textStyle ]}
                            returnKeyType='go'
                            autoFocus
                            placeholderTextColor={brandColor}
                            selectionColor={brandColor}
                            maxLength={this.state.enterCode ? 6 : 20}
                            onSubmitEditing={this._getSubmitAction} />

                    </View>

                    <TouchableOpacity style={styles.button} onPress={this._getSubmitAction}>
                        <Text style={styles.buttonText}>{ buttonText }</Text>
                    </TouchableOpacity>

                    {this._renderFooter()}

                </Form>

                <Spinner
                    visible={this.state.spinner}
                    textContent={'One moment...'}
                    textStyle={{ color: '#fff' }} />

            </View>

        );
    }
}

AppRegistry.registerComponent('example', () => example);
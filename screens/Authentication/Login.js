import React from "react";
import jwt from 'jwt-decode';
import axios from 'axios';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
} from "react-native";
import { FONTS, SIZES, COLORS, icons } from "../../constants"
import { AuthenticationLayout } from "../../screens"
import { Logo, TextButton, FormInput, PrimaryButton } from "../../components"
import Validation from "../../validation/Validation";
import Route from "../../routes/Route";
import AsyncStorage from '@react-native-async-storage/async-storage';


const Login = ({ navigation }) => {
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [emailError, setEmailError] = React.useState("")

    const [showPass, setShowPass] = React.useState(false)
    const [saveMe, setSaveMe] = React.useState(false)
    const [loginError, setLoginError] = React.useState(false)

    function isEnableSignIn() {
        return email != "" && password != "" && emailError == ""
    }
    async function setAccessToken(id) {
        let accessToken = jwt("eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJteXNlbHNlcnZpY2UiLCJpYXQiOjE2NzgyNzM0NzAsImV4cCI6MTcwOTgwOTQ3MCwiYXVkIjoidXNlcklkIiwic3ViIjoib3lrdWRhbmlzaWtAZ21haWwuY29tIiwicmVzdElkIjoiMSIsInJvbGUiOiJtYW5hZ2VyIn0.fC72gRlrUnpMvys5hvL2dTL2J3XyEoDGTSUMz-4ZZ2w");
        await AsyncStorage.setItem('accessToken', JSON.stringify(accessToken));
        let res = await AsyncStorage.getItem("accessToken")
        console.log(res)
    }
    
    function authenticate() {
        console.log(Route.host);
        console.log(email);
        console.log(password);
        axios({
          method: 'post',
          url: Route.host + '/login',
          data: {
            email: email,
            password: password
          }
        }).then((response) => {
          console.log(response);
        }, (error) => {
          console.log(error);
        });
    }
    React.useEffect(() => {
        setAccessToken()
    },[])
    return (
        <AuthenticationLayout
            title="Login Page"
        >
            <Logo></Logo>
            <View
                style={{
                    flex: 1,
                    marginTop: SIZES.height > 800 ? SIZES.padding * 2 : SIZES.radius,
                }}
            >
                {/* Form Inputs */}
                <FormInput
                    label="Email"
                    keyboardType="email-address"
                    autoCompleteType="email"
                    value={email}
                    containerStyle={{
                        marginTop: SIZES.radius,
                    }}
                    onChange={(value) => {
                        Validation.validateEmail(value, setEmailError)
                        setEmail(value)
                    }}
                    errorMsg={loginError ? "Email Error" : ""}
                    appendComponent={
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Image
                                source={(email == "") || (email != "" && emailError == "") ? icons.correct : icons.cancel}
                                style={{
                                    height: 20,
                                    width: 20,
                                    tintColor: (email == "") ? COLORS.gray : (email != "" && emailError == "") ? COLORS.green : COLORS.red
                                }}
                            />
                        </View>
                    }
                />
                <FormInput
                    label="Password"
                    secureTextEntry={!showPass}
                    autoCompleteType="password"
                    containerStyle={{
                        marginTop: SIZES.radius,
                    }}
                    errorMsg={loginError ? "Password Error" : ""}
                    value={password}
                    onChange={(value) => setPassword(value)}
                    appendComponent={
                        <TouchableOpacity
                            style={{
                                width: 40,
                                alignItems: 'flex-end',
                                justifyContent: 'center',
                            }}
                            onPress={() => setShowPass(!showPass)}
                        >
                            <Image
                                source={showPass ? icons.eye_close : icons.eye}
                                style={{
                                    height: 20,
                                    width: 20,
                                    tintColor: COLORS.gray
                                }}
                            />
                        </TouchableOpacity>
                    }
                />
                {/* Save me & Forgot pass */}
                <View
                    style={{
                        flexDirection: 'row',
                        marginTop: SIZES.radius,
                        marginBottom: SIZES.radius,
                        justifyContent: 'space-between'
                    }}
                >
                    <TextButton
                        label="Forgot Password?"
                        buttonContainerStyle={{
                            backgroundColor: null
                        }}
                        labelStyle={{
                            color: COLORS.gray,
                            ...FONTS.body4
                        }}
                        onPress={() => navigation.navigate("ForgotPassword")}
                    />
                </View>

                <PrimaryButton
                    onPress={() => {
                        if (authenticate()) {
                            navigation.navigate("Home");
                        } else {
                            setLoginError(true);
                        }
                    }}
                    title="Log In"
                />

                {/* Sign Up */}
                <View
                    style={{
                        flexDirection: 'row',
                        marginTop: SIZES.radius,
                        justifyContent: 'center'
                    }}
                >
                    <Text style={{ color: COLORS.darkGray, ...FONTS.body3 }}>Don't have an account? </Text>
                    <TextButton
                        label="Sign Up"
                        buttonContainerStyle={{
                            backgroundColor: null
                        }}
                        labelStyle={{
                            color: COLORS.primary,
                            ...FONTS.h3
                        }}
                        onPress={() => navigation.navigate("Register")}
                    />
                </View>
            </View>
        </AuthenticationLayout>
    )
}
export default Login;
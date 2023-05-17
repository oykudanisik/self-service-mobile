import React, { useEffect } from "react";
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
    async function setAccessToken(token) {
        await AsyncStorage.setItem('accessToken', JSON.stringify(jwt(token)));
    }

    function authenticate() {
        axios({
            method: 'post',
            url: Route.host + '/login',
            data: {
                email: email,
                password: password
            }
        }).then((response) => {
            if (response.data.status == 200) {
                let role = JSON.stringify(jwt(response.data.items));
                role = JSON.parse(role).role;
                setAccessToken(response.data.items);
                setLoginError(false);
                console.log(role);
                if (role == "waiter") {
                    navigation.navigate("Tables2");
                } else if (role == "customer") {
                    navigation.navigate("Home");
                } else {
                    setLoginError(true);
                }
            }
        }, (error) => {
            setLoginError(true);
            console.log(error);
        });
    }
    async function getToken() {
        await AsyncStorage.getItem("accessToken");
    }

    useEffect(() => {
        getToken();
    }, [])
    return (
        <AuthenticationLayout
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
                        paddingBottom:40
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


                <PrimaryButton
                    onPress={() => {
                        authenticate()
                    }}
                    title="Log In"
                />

                {/* Sign Up */}
                <View
                    style={{
                        marginTop: SIZES.radius,
                        marginBottom: SIZES.radius,
                        flexDirection: 'row',
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
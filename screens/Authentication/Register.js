import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
} from "react-native";
import { FONTS, SIZES, COLORS, icons, images } from "../../constants"
import { PrimaryButton, FormInput, TextButton, PhoneNumberInput } from "../../components";
import AuthenticationLayout from "./AuthenticationLayout"
import Validation from "../../validation/Validation";

const Register = ({ navigation }) => {
    const [email, setEmail] = React.useState("")
    const [phonenumber, setPhonenumber] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [fullname, setFullname] = React.useState("")

    const [showPass, setShowPass] = React.useState(false)

    const [emailError, setEmailError] = React.useState("")
    const [phonenumberError, setPhonenumberError] = React.useState("")
    const [passwordError, setPasswordError] = React.useState("")
    const [fullnameError, setFullnameError] = React.useState("")

    function isEnableSignUp() {
        return email != "" && fullname != "" && password != "" && phonenumber != "" && emailError == "" && passwordError == ""
    }

    return (
        <AuthenticationLayout
            title="Register Page"
        >
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>

                <Image
                    style={{
                        width: 180,
                        height: 90,
                    }}
                    source={images.logo}>
                </Image>
            </View>
            <View
                style={{
                    flex: 1,
                    marginTop: SIZES.height > 800 ? SIZES.padding * 2 : SIZES.radius,
                }}
            >
                <FormInput
                    label="Full Name"
                    containerStyle={{
                        marginTop: SIZES.radius,
                    }}
                    value={fullname}
                    onChange={(value) => {
                        setFullname(value)
                    }}
                    errorMsg={fullnameError}
                    appendComponent={
                        <View
                            style={{
                                justifyContent: 'center'
                            }}
                        >
                            <Image
                                source={(fullname == "") || (fullname != "" && fullnameError == "") ? icons.correct : icons.cancel}
                                style={{
                                    height: 20,
                                    width: 20,
                                    tintColor: (fullname == "") ? COLORS.gray : (fullname != "" && fullnameError == "") ? COLORS.green : COLORS.red
                                }}
                            />
                        </View>
                    }
                />
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
                    errorMsg={emailError}
                    appendComponent={
                        <View
                            style={{
                                justifyContent: 'center'
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

                <PhoneNumberInput
                    label="Phone Number"
                    containerStyle={{
                        marginTop: SIZES.radius,
                    }}
                    value={phonenumber}
                    onChange={(value) => {
                        setPhonenumber(value)
                    }}
                    errorMsg={phonenumberError}
                    appendComponent={
                        <View
                            style={{
                                justifyContent: 'center'
                            }}
                        >
                            <Image
                                source={(phonenumber == "") || (phonenumber != "" && phonenumberError == "") ? icons.correct : icons.cancel}
                                style={{
                                    height: 20,
                                    width: 20,
                                    tintColor: (phonenumber == "") ? COLORS.gray : (phonenumber != "" && phonenumberError == "") ? COLORS.green : COLORS.red
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
                        marginBottom: SIZES.radius,
                    }}
                    value={password}
                    onChange={(value) => {
                        Validation.validatePassword(value, setPasswordError)
                        setPassword(value)
                    }}
                    errorMsg={passwordError}
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
                    onPress={() => navigation.navigate('Home')}
                    title="Sign Up"
                />
                {/* Sign Up & Sign In */}
                <View
                    style={{
                        flexDirection: 'row',
                        marginTop: SIZES.radius,
                        justifyContent: 'center'
                    }}
                >
                    <Text style={{ color: COLORS.darkGray, ...FONTS.body3 }}>Already have an account? </Text>
                    <TextButton
                        label="Sign In"
                        buttonContainerStyle={{
                            backgroundColor: null
                        }}
                        labelStyle={{
                            color: COLORS.primary,
                            ...FONTS.h3
                        }}
                        onPress={() => navigation.navigate("Login")}
                    />
                </View>
            </View>
        </AuthenticationLayout>
    )
}

export default Register
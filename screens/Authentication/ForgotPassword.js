import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
} from "react-native";

import AuthenticationLayout from "./AuthenticationLayout"
import { FONTS, SIZES, COLORS, icons, images } from "../../constants"
import FormInput from "../../components/FormInput";
import TextButton from "../../components/TextButton";
import Logo from "../../components/Logo";
// import { utils } from "../../utils";

const ForgotPassword = ({ navigation }) => {

    const [email, setEmail] = React.useState("")
    const [emailError, setEmailError] = React.useState("")

    function isEnableSendEmail() {
        return email != "" && emailError == ""
    }

    return (
        <AuthenticationLayout
            title="Password Recovery"
            titleContainerStyle={{
                marginTop: SIZES.padding * 2
            }}
        >
            <Logo></Logo>
            <View
                style={{
                    flex: 1,
                    marginTop: SIZES.padding * 2
                }}
            >
                {/* Form Inputs */}
                <FormInput
                    label="Email"
                    keyboardType="email-address"
                    autoCompleteType="email"
                    value={email}
                    // onChange={(value) => {
                    //     utils.validateEmail(value, setEmailError)
                    //     setEmail(value)
                    // }}
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

                <View
                    style={{
                        flexDirection: 'row',
                        marginTop: SIZES.radius,
                        justifyContent: 'center'
                    }}
                >
                    <Text style={{ color: COLORS.darkGray, ...FONTS.body3 }}>Already have an account? </Text>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={{ color: COLORS.primary, ...FONTS.h3 }}>Sign In</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Sign In & Sign Up */}
            <TextButton
                label="Send Email"
                disabled={isEnableSendEmail() ? false : true}
                buttonContainerStyle={{
                    height: 55,
                    alignItems: 'center',
                    marginTop: SIZES.padding,
                    borderRadius: SIZES.radius,
                    backgroundColor: isEnableSendEmail() ? COLORS.primary : COLORS.transparentPrimary,
                }}
                onPress={() => navigation.goBack()}
            />
        </AuthenticationLayout>
    )
}

export default ForgotPassword;
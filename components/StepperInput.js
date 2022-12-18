import React from 'react';
import {
    View,
    Text,
    Image
} from 'react-native';

import { FONTS, COLORS, icons, SIZES } from "../constants"

const StepperInput = ({
    containerStyle,
    value = 1,
    onAdd,
    onMinus,
}) => {
    return (
        <View
            style={{
                flexDirection: 'row',
                height: 60,
                width: 130,
                backgroundColor: COLORS.lightGray2,
                borderRadius: SIZES.radius,
                ...containerStyle
            }}
        >
            <Image
                source={icons.minus}
                style={{
                    height: 25,
                    width: 25,
                    tintColor: COLORS.primary,
                }}
            />
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Text style={{ ...FONTS.h2 }}>{value}</Text>
            </View>
            <Image
                source={icons.plus}
                style={{
                    height: 25,
                    width: 25,
                    tintColor: COLORS.primary,
                }}
            />
        </View>
    )
}

export default StepperInput
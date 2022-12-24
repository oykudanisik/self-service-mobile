import React from 'react';
import {
    View,
    Text,
} from 'react-native';

import IconButton from './IconButton';
import { icons, images, SIZES, COLORS, FONTS } from '../constants'

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
            <IconButton
                containerStyle={{
                    width: 40,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                icon={icons.minus}
                iconStyle={{
                    height: 20,
                    width: 20,
                    tintColor: COLORS.primary,
                }}
                onPress={onMinus}
            />

            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Text style={{ ...FONTS.body3 }}>{value}</Text>
            </View>
            
            <IconButton
                containerStyle={{
                    width: 40,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                icon={icons.plus}
                iconStyle={{
                    height: 20,
                    width: 20,
                    tintColor: COLORS.primary,
                }}
                onPress={onAdd}
            />
        </View>
    )
}

export default StepperInput
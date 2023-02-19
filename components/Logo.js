import React from 'react';
import {
    View,
    Image,
} from 'react-native';

import { images } from "../constants"

const Logo = () => {
    return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Image
                style={{
                    width: 180,
                    height: 90,
                }}
                source={images.logo}>
            </Image>
        </View>
    )
}

export default Logo;
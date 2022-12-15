import React from "react";
import {
    View,
    TouchableOpacity,
    Image,
} from "react-native";

import { icons, images, SIZES, COLORS, FONTS } from '../constants'

export default function Header({navigation}){
    return (
            <View style={{ flexDirection: 'row', height: "13%" ,marginBottom:10}}>
                <TouchableOpacity
                    onPress={() => navigation.navigate("Home")}
                    style={{
                        width: 50,
                        paddingLeft: SIZES.padding * 2,
                        justifyContent: 'center'
                    }}
                >
                    <Image
                        source={icons.list}
                        resizeMode="contain"
                        style={{
                            width: 25,
                            height: 25,
                        }}
                    />
                </TouchableOpacity>

                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                
                         <Image 
                            style={{
                                marginTop:10,
                                width: 180,
                                height: 100,
                                paddingRight: SIZES.padding * 2,
                                justifyContent: 'center'
                            }}
                            source={images.logo}>
                        </Image>
                </View>

                <TouchableOpacity
                    onPress={() => navigation.navigate("Profile")}
                    style={{
                        width: 50,
                        paddingRight: SIZES.padding * 2,
                        justifyContent: 'center'
                    }}
                >
                    <Image
                        source={icons.user}
                        resizeMode="contain"
                        style={{
                            width: 25,
                            height: 25,
                        }}
                    />
                </TouchableOpacity>
            </View>
    )
}
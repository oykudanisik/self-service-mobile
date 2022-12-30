import React from "react";
import { useEffect } from "react";
import axios from'axios';
import {
    StyleSheet,
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    Image,
    Animated,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isIphoneX } from 'react-native-iphone-x-helper'
import HeaderInside from '../components/HeaderInside';
import { icons, COLORS, SIZES, FONTS } from '../constants'

const FoodItem = ({ route, navigation }) => { 
    const scrollX = new Animated.Value(0);
    const [orderItems, setOrderItems] = React.useState([]);
    const [scanned, setScanned] = React.useState(route.params.scanned);
    
    function renderFoodInfo() {
        return (
            <Animated.ScrollView
                horizontal
                pagingEnabled
                scrollEventThrottle={16}
                snapToAlignment="center"
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event([
                    { nativeEvent: { contentOffset: { x: scrollX } } }
                ], { useNativeDriver: false })}
            >
                        <View
                            style={{ alignItems: 'center' }}
                        >
                            <View style={{ height: SIZES.height * 0.35 }}>
                                {/* Food Image */}
                                <Image
                                    source={{uri:route.params.item.image}}
                                    resizeMode="cover"
                                    style={{
                                        width: SIZES.width,
                                        height: "100%"
                                    }}
                                />
                            </View>

                            {/* Name & Description */}
                            <View
                                style={{
                                    width: SIZES.width,
                                    alignItems: 'center',
                                    marginTop: 15,
                                    paddingHorizontal: SIZES.padding * 2
                                }}
                            >
                                <Text style={{ marginVertical: 10, textAlign: 'center', ...FONTS.h2 }}>{route.params.item.name}</Text>
                                <Text style={{ ...FONTS.body3 }}>{route.params.item.description}</Text>
                                <Text style={{ ...FONTS.h2 }}>{route.params.item.price} {route.params.item.currency}</Text>
                                <Text style={{ ...FONTS.body3 }}>Ready in {route.params.item.prepDurationMinutes} minutes</Text>
                            </View>
                        </View>
            </Animated.ScrollView>
        )
    }
    function renderOrder() {
        return (
            <View>
                <View
                    style={{
                        backgroundColor: COLORS.white,
                        borderTopLeftRadius: 40,
                        borderTopRightRadius: 40
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingVertical: SIZES.padding * 2,
                            paddingHorizontal: SIZES.padding * 3,
                            borderBottomColor: COLORS.lightGray2,
                            borderBottomWidth: 1
                        }}
                    >
                    </View>
                    {/* Order Button */}
                    <View
                        style={{
                            padding: SIZES.padding * 2,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                width: SIZES.width * 0.9,
                                padding: SIZES.padding,
                                backgroundColor: COLORS.primary,
                                alignItems: 'center',
                                borderRadius: SIZES.radius
                            }}
                            onPress={
                                async () => {
                                let items = await AsyncStorage.getItem("item");
                                if(items == null){
                                    let array = [];
                                    route.params.item['count'] = 1;
                                    array.push(route.params.item);
                                    await AsyncStorage.setItem(
                                        "item", 
                                        JSON.stringify(array),
                                    );
                                } else{
                                    let cartItems = await JSON.parse(items);
                                    var found = false;
                                    for(var i = 0; i<cartItems.length && !found;i++) {
                                        if(cartItems[i].id === route.params.item.id){
                                            cartItems[i].count ++;
                                            found = true;
                                        } 
                                    }
                                    if(!found){
                                        route.params.item['count'] = 1;
                                        cartItems.push(route.params.item);
                                    }

                                    await AsyncStorage.setItem(
                                        "item", 
                                        JSON.stringify(cartItems),
                                    );
                                }
                                await navigation.goBack();
                            }}
                        >
                            <Text style={{ color: COLORS.white, ...FONTS.h2 }}>Add</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {isIphoneX() &&
                    <View
                        style={{
                            position: 'absolute',
                            bottom: -34,
                            left: 0,
                            right: 0,
                            height: 34,
                            backgroundColor: COLORS.white
                        }}
                    >
                    </View>
                }
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <HeaderInside navigation={navigation}/>
            {renderFoodInfo()}
            {/* {renderOrder()} */}
            {scanned ? renderOrder() : ""}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.lightGray
    }
})

export default FoodItem;
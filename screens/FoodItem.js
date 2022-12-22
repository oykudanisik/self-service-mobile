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
    const [currentLocation, setCurrentLocation] = React.useState(null);
    const [orderItems, setOrderItems] = React.useState([]);
    const [scanned, setScanned] = React.useState(route.params.scanned);

    React.useEffect(() => {
        // console.log(orderItems);
    },[orderItems])

    function editOrder(action, menuId, price) {
        let orderList = orderItems.slice()
        let item = orderList.filter(a => a.menuId == menuId)
        console.log(item);
        if (action == "+") {
            if (item.length > 0) {
                let newQty = item[0].qty + 1
                item[0].qty = newQty
                item[0].total = item[0].qty * price
            } else {
                const newItem = {
                    menuId: menuId,
                    qty: 1,
                    price: price,
                    total: price,
                }
                orderList.push(newItem)
            }

            setOrderItems(orderList)
        } else {
            if (item.length > 0) {
                if (item[0]?.qty > 0) {
                    let newQty = item[0].qty - 1
                    item[0].qty = newQty
                    item[0].total = newQty * price
                }
            }

            setOrderItems(orderList)
        }
    }

    function getOrderQty(menuId) {
        let orderItem = orderItems.filter(a => a.menuId == menuId)

        if (orderItem.length > 0) {
            return orderItem[0].qty
        }

        return 0
    }

    // function getBasketItemCount() {
    //     let itemCount = orderItems.reduce((a, b) => a + (b.qty || 0), 0)

    //     return itemCount
    // }

    // function sumOrder() {
    //     let total = orderItems.reduce((a, b) => a + (b.total || 0), 0)

    //     return total.toFixed(2)
    // }

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
                        {/* <Text style={{ ...FONTS.h3 }}>{getBasketItemCount()} items in Cart</Text> */}
                        {/* <Text style={{ ...FONTS.h3 }}>${sumOrder()}</Text> */}
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
                                let x = await AsyncStorage.getItem("item");
                                if(x == null){
                                    let array = [];
                                    array.push(route.params.item);
                                    await AsyncStorage.setItem(
                                        "item", 
                                        JSON.stringify(array),
                                    );
                                } else{
                                    x = JSON.parse(x);
                                    x.push(route.params.item);
                                    await AsyncStorage.setItem(
                                        "item", 
                                        JSON.stringify(x),
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
            {renderOrder()}
            {/* {scanned ? renderOrder() : ""} */}
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
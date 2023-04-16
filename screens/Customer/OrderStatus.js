import React, { useMemo, useState, useEffect, useCallback } from 'react';
import {
    Animated,
    Image,
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    TouchableHighlight
} from 'react-native';
import Slider from '@react-native-community/slider'
import { HeaderOrder } from '../../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Route from '../../routes/Route';
// constants
import { images, SIZES, COLORS, FONTS, icons } from '../../constants'

const OrderStatus = ({ navigation }) => {
    const [orderStatus, setOrderStatus] = React.useState();
    const [order, setOrder] = React.useState();

    async function getOrderStatus() {
        let token = await AsyncStorage.getItem("accessToken");
        console.log(token);
        token = JSON.parse(token);
        axios({
            method: "get",
            url: Route.host + '/users/' + parseInt(token.uid) + '/orders',
        }).then(function (response) {
            setOrder(response.data.items)
            console.log(response.data.items)
        });
    }

    useEffect(() => {
        getOrderStatus();
        // console.log(order);
        // const interval = setInterval(() => {
        //     getOrderStatus();
        //   }, 10000);
        //   return () => clearInterval(interval);
    }, [])

    function renderTable() {
        const renderItem = ({ item }) => (
            <TouchableOpacity
                  style={{
                    marginBottom: SIZES.padding * 2,
                    width: "100%",
                }}
                onPress={() => navigation.navigate("Menu", {
                    item, scanned
                })}
            >
                <View
                    style={{
                        height: 100,
                        backgroundColor: COLORS.lightGray4,
                        ...styles.cartItemContainer
                    }}
                >
                    <View
                        style={{
                            width: 90,
                            height: 100,
                            marginLeft: -10
                        }}
                    >
                        <Image
                            source={images.waiter}
                            resizeMode="contain"
                            style={{
                                width: "75%",
                                height: "75%",
                                position: 'absolute',
                                borderRadius: 10,
                                top: 10,
                            }}
                        />
                    </View>
                    {/* Food Info */}
                    <View
                        style={{
                            flex: 1
                        }}
                    >
                        <Text style={{ ...FONTS.h4 }}>{item.prod_name}<Text style={{ ...FONTS.body3 }}> x{item.quantity}</Text> </Text>
                        <View
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                height: 40,
                                width: SIZES.width * 0.15,
                                backgroundColor: COLORS.lightGray2,
                                borderTopRightRadius: SIZES.radius,
                                borderBottomLeftRadius: SIZES.radius,
                                alignItems: 'center',
                                justifyContent: 'center',
                                ...styles.shadow
                            }}
                        >
                            <Text style={{ ...FONTS.body4 }}>{item.order_status}</Text>
                        </View>
                    </View>

                </View>

            </TouchableOpacity>
        )

        return (
            <FlatList
                data={order}
                keyExtractor={item => `${item.order_item_id}`}
                renderItem={renderItem}
                contentContainerStyle={{
                    paddingHorizontal: SIZES.padding * 2,
                    paddingBottom: 30,
                }}
            />
        )
    }
    return (
        <SafeAreaView style={styles.container}>
            <HeaderOrder navigation={navigation}></HeaderOrder>
            <View
                style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
            >
            </View>
            <Text style={{ ...FONTS.h2, alignItems: "center" }}>
                <Image
                    source={icons.order}
                    resizeMode="contain"
                    style={{
                        width: 25,
                        height: 25,
                    }}
                />
                <Text> My Orders</Text>
            </Text>
            {renderTable()}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    cartItemContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: SIZES.radius,
        paddingHorizontal: SIZES.radius,
        borderRadius: SIZES.radius,
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.lightGray5,
    }
})


export default OrderStatus;

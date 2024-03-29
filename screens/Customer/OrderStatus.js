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
    TouchableHighlight,
    RefreshControl,
    ScrollView
} from 'react-native';
import Slider from '@react-native-community/slider'
import { HeaderOrder, PrimaryButton, SecondaryButton } from '../../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Route from '../../routes/Route';
// constants
import { images, SIZES, COLORS, FONTS, icons } from '../../constants'

const OrderStatus = ({ navigation }) => {
    const [orderStatus, setOrderStatus] = React.useState();
    const [order, setOrder] = React.useState([{}]);
    const [selectedCard, setSelectedCard] = React.useState(null)
    const [ordersCount, setOrdersCount] = React.useState()
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getOrderStatus();
        setTimeout(() => {
            setRefreshing(false);
            getOrderStatus();
        }, 2000);
    }, []);

    async function getOrderStatus() {
        try {
            let token = await AsyncStorage.getItem("accessToken");
            token = JSON.parse(token);
            let restId = await AsyncStorage.getItem("restaurantId");

            console.log("a", token.uid);
            console.log("b", restId);

            const response = await axios.get(
                Route.host + '/users/orders?userId=' + token.uid + '&resId=' + restId
            );

            console.log("c", response.data);
            setOrder(response.data.data);
            setOrdersCount(response.data.count);
        } catch (error) {
            console.log(error);
        }
    }
    async function cancelOrder(orderId) {
        let restId = await AsyncStorage.getItem("restaurantId");
        console.log("rr", restId);
        axios({
            method: 'post',
            url: Route.host + '/restaurants/orders/alter',
            data: {
                order_status: "cancelled",
                rest_id: parseInt(restId),
                order_item_id: parseInt(orderId)
            }
        }).then((response) => {
            console.log(response);
            getOrderStatus();

        }, (error) => {
            console.log(error);
        });
    }
    useEffect(() => {
        getOrderStatus();
        console.log("oluto");
    }, []);


    function renderTable() {
        if (order.length === 0 || (order.length === 1 && Object.keys(order[0]).length === 0)) {
            return (
                <ScrollView
                    contentContainerStyle={styles.container}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Image
                            source={images.noorder}
                            resizeMode="cover"
                            style={{
                                width: "70%",
                                height: "70%",
                            }}
                        />
                        <Text style={{ ...FONTS.h3, marginTop: 10, textAlign: 'center' }}>No orders at the moment</Text>
                    </View>
                </ScrollView>


            );
        }
        const renderItem = ({ item }) => (
            <TouchableOpacity
                style={{
                    marginBottom: SIZES.padding * 2,
                    width: "100%",
                }}
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
                            marginLeft: -10,
                        }}
                    >
                        <Image
                            source={icons.order}
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
                        <Text style={{ ...FONTS.h4 }}>
                            {item.prod_name}<Text style={{ ...FONTS.body3 }}> x{item.prod_count}</Text>
                        </Text>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <Text style={{ ...FONTS.body4 }}> {item.order_status === "To do" ? "Waiting" : item.order_status}   </Text>
                            {item.order_status === "To do" && (
                                <SecondaryButton
                                    title="Cancel"
                                    onPress={() => {
                                        cancelOrder(item.order_item_id);
                                    }}
                                />
                            )}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>

        );

        return (
            <FlatList
                data={order}
                keyExtractor={item => `${item.order_item_id}`}
                renderItem={renderItem}
                contentContainerStyle={{
                    paddingHorizontal: SIZES.padding * 2,
                    paddingBottom: 30,
                }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <HeaderOrder navigation={navigation} ordersCount={ordersCount}></HeaderOrder>
            <Text style={{ ...FONTS.h2, textAlign: "center", alignItems: "center", justifyContent: "center", paddingTop: 20 }}> My Orders</Text>
            {renderTable()}
            <PrimaryButton
                onPress={() => navigation.navigate("Pay")}
                title="PAY"
            />
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
});

export default OrderStatus;

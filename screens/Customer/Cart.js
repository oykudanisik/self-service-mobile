import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    View,
    Text,
    Image,
    StyleSheet,
    RefreshControl,
    ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { SwipeListView } from 'react-native-swipe-list-view';
import { PrimaryButton } from '../../components/Button';

import { StepperInput, FooterTotal, HeaderInside, HeaderOrder } from '../../components';
import { FONTS, SIZES, COLORS, icons, images } from "../../constants"
import uuid from 'react-uuid';
import Route from "../../routes/Route";


const Cart = ({ navigation }) => {

    // AsyncStorage.clear();
    const [myCartList, setMyCartList] = React.useState([])
    const [totalPrice, setTotalPrice] = React.useState(0);
    const [accessToken, setAccessToken] = React.useState({});
    const [orderId, setOrderId] = React.useState("");
    const [orderStatus, setOrderStatus] = React.useState("");
    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getOrderStatus()
        setTimeout(() => {
            setRefreshing(false);
            deneme();
        }, 2000);
    }, []);
    const [ordersCount, setOrdersCount] = useState(0);

    let price = 0
    let cartList = [];

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
            setOrdersCount(response.data.count);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getOrderStatus();
    }, []);
    async function deneme() {
        let cartList = await AsyncStorage.getItem("item");
        let rest_id = await AsyncStorage.getItem("restaurantId");
        rest_id = parseInt(rest_id);
        cartList = JSON.parse(cartList);

        let totalPrice = 0;

        if (cartList) {
            const filteredCartList = cartList.filter((item) => item.rest_id === rest_id);
            console.log("filtered", filteredCartList)
            if (filteredCartList.length != 0) {
                filteredCartList.forEach((item) => {
                    totalPrice += item.price * item.count;
                });
                setTotalPrice(totalPrice);
                setMyCartList(filteredCartList);
            } else {
                setTotalPrice(0);
                setMyCartList([]);
            }

        } else {
            setTotalPrice(0);
            setMyCartList([]);
        }
    }

    async function placeOrder() {
        let token = await AsyncStorage.getItem("accessToken");
        token = JSON.parse(token);
        let details = [];
        let restId = await AsyncStorage.getItem("restaurantId");
        let tableId = await AsyncStorage.getItem("tableId");
        // let orders = await AsyncStorage.getItem("item");
        // orders = JSON.parse(orders);
        console.log("myasdasdıjdlfjsd", myCartList);
        myCartList.forEach((element, index, array) => {
            details.push({ "prod_id": element.prod_id, "price": element.price, "prod_count": element.count })
        })
        console.log("details", JSON.stringify(details));
        console.log(parseInt(token.uid))
        console.log(parseInt(restId))

        axios({
            method: 'post',
            url: Route.host + '/orders',
            data: {
                details: JSON.stringify(details),
                order_id: uuid(),
                user_id: parseInt(token.uid),
                rest_id: parseInt(restId),
                table_id: parseInt(tableId),
                order_status: "To do",
            }
        }).then((response) => {
            AsyncStorage.removeItem("item")
                .then(() => {
                    console.log('Item removed successfully');
                })
                .catch((error) => {
                    console.log('Error removing item:', error);
                });
            deneme();

        }, (error) => {
            console.log("e", error);
        });
    }

    async function updateQuantityHandler(newQty, id) {
        if (newQty < 1) {
            await deleteItem(id);
            return;
        }

        const newMyCartList = myCartList.map((item) =>
            item.prod_id === id ? { ...item, count: newQty } : item
        );

        setMyCartList(newMyCartList);

        let cartList = await AsyncStorage.getItem("item");
        let cartItems = JSON.parse(cartList);

        for (var i = 0; i < cartItems.length; i++) {
            if (cartItems[i].prod_id === id) {
                cartItems[i].count = newQty;
                break; // Break the loop after updating the count
            }
        }

        await AsyncStorage.setItem("item", JSON.stringify(cartItems));

        // Recalculate the total price
        let totalPrice = 0;
        newMyCartList.forEach((item) => {
            totalPrice += item.price * item.count;
        });
        setTotalPrice(totalPrice);
    }

    async function deleteItem(id) {
        let cartList = await AsyncStorage.getItem("item");
        let cartItems = JSON.parse(cartList);

        // Filter out the item with the specified prod_id
        cartItems = cartItems.filter((item) => item.prod_id !== id);

        await AsyncStorage.setItem("item", JSON.stringify(cartItems));

        setMyCartList(cartItems);
        deneme();
    }
    React.useEffect(() => {
        deneme();
        console.log("aslkdnaklsjdklasjdkladf", myCartList.length)

    }, []);
    function renderCartList() {
        if (myCartList.length === 0 || (myCartList.length === 1 && Object.keys(myCartList[0]).length === 0)) {
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
                            source={images.emptycart}
                            resizeMode="cover"
                            style={{
                                width: "70%",
                                height: "70%",
                            }}
                        />
                        <Text style={{ ...FONTS.h3, marginTop: 10, textAlign: 'center' }}>No items in the cart</Text>
                    </View>
                </ScrollView>

            );
        }
        return (
            <SwipeListView
                onRowOpen={(rowKey, rowMap, toValue) => {
                    if (toValue < -75) {
                        navigation.navigate('Menu'); // Redirect to the Menu screen
                    }
                }}
                data={myCartList}
                keyExtractor={item => `${item.prod_id}`}
                contentContainerStyle={{
                    marginTop: SIZES.radius,
                    paddingHorizontal: SIZES.padding,
                    paddingBottom: SIZES.padding * 2
                }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                disableRightSwipe={true}
                rightOpenValue={-75}
                renderItem={(data, rowMap) => (
                    data.item.prod_image ? (
                        <View>

                            <View
                                style={{
                                    height: 100,
                                    backgroundColor: COLORS.lightGray4,
                                    ...styles.cartItemContainer
                                }}
                            >
                                {/* Food Image */}
                                <View
                                    style={{
                                        width: 90,
                                        height: 100,
                                        marginLeft: -10
                                    }}
                                >
                                    {data.item.prod_image ? (<Image
                                        source={{ uri: data.item.prod_image['String'] }}
                                        resizeMode="cover"
                                        style={{
                                            width: "75%",
                                            height: "75%",
                                            position: 'absolute',
                                            borderRadius: 10,
                                            top: 10,
                                        }}
                                    />) : (<Image
                                        source={images.logo}
                                        resizeMode="cover"
                                        style={{
                                            width: "100%",
                                            height: 200,
                                            borderRadius: SIZES.radius
                                        }}
                                    />)}
                                </View>

                                {/* Food Info */}
                                <View
                                    style={{
                                        flex: 1
                                    }}
                                >
                                    <Text style={{ ...FONTS.body3 }}>{data.item.prod_name}</Text>
                                    <Text style={{ color: COLORS.black, ...FONTS.h4 }}>{data.item.price} {data.item.currency}</Text>
                                </View>

                                {/* Quantity */}
                                <StepperInput
                                    containerStyle={{
                                        height: 40,
                                        width: 100,
                                        backgroundColor: COLORS.white
                                    }}
                                    value={data.item.count}
                                    onAdd={() => { updateQuantityHandler(data.item.count + 1, data.item.prod_id) }}
                                    onMinus={() => { updateQuantityHandler(data.item.count - 1, data.item.prod_id) }}
                                />
                                <TouchableHighlight
                                    onPress={() => { deleteItem(data.item.prod_id) }}>
                                    <View
                                        style={{
                                            width: 30,
                                            height: 30,
                                            marginLeft: 10
                                        }}
                                    >

                                        <Image
                                            source={icons.bin}
                                            resizeMode="contain"
                                            style={{
                                                width: "65%",
                                                height: "65%",
                                                position: 'absolute',
                                            }}
                                        />
                                    </View>
                                </TouchableHighlight>
                            </View>

                        </View>
                    ) :
                        (
                            <View style={{ paddingTop: 150, paddingBottom: 300, flex: 1, alignItems: "center", justifyContent: "center" }}>
                                <Text style={{ ...FONTS.h4, textAlign: "center" }}>Your cart is empty</Text>
                            </View>

                        )
                )}
            />
        )
    }

    function renderFooter() {
        return (
            <FooterTotal
                subTotal={37.97}
                shippingFee={0.00}
                total={totalPrice}
            />
        )
    }
    return (

        <SafeAreaView style={styles.container}>
            {/* Header */}
            <HeaderOrder navigation={navigation} ordersCount={ordersCount} ></HeaderOrder>
            <Text style={{ ...FONTS.h2, textAlign: "center", alignItems: "center", justifyContent: "center", paddingTop: 20 }}> My Cart</Text>
            {/* Cart */}
            {renderCartList()}
            {/* Footer */}
            {renderFooter()}
            <PrimaryButton
                onPress={async () => {
                    await placeOrder();
                    navigation.navigate("OrderStatus");
                }}
                disabled={myCartList.length === 0}
                buttonStyle={{
                    backgroundColor: myCartList.length === 0 ? COLORS.lightGray : COLORS.primary,
                }}
                title="ORDER"
            />
        </SafeAreaView>
    );
}

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
    },
});

export default Cart;
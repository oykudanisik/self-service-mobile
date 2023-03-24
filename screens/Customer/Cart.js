import React from 'react';
import axios from 'axios';
import {
    View,
    Text,
    Image,
    StyleSheet
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { SwipeListView } from 'react-native-swipe-list-view';
import { PrimaryButton } from '../../components/Button';

import { StepperInput, FooterTotal, HeaderInside, HeaderOrder } from '../../components';
import { FONTS, SIZES, COLORS, icons } from "../../constants"
import uuid from 'react-uuid';
import Route from "../../routes/Route";


const Cart = ({ navigation }) => {

    // AsyncStorage.clear();
    const [myCartList, setMyCartList] = React.useState([])
    const [totalPrice, setToralPrice] = React.useState(0);
    const [accessToken, setAccessToken] = React.useState({});
    const [orderId, setOrderId] = React.useState("");
    const [orderStatus, setOrderStatus] = React.useState("");

    let price = 0
    let cartList = [];

    React.useEffect(() => {
        async function deneme() {
            cartList = await AsyncStorage.getItem("item")
            cartList = JSON.parse(cartList);
            cartList.forEach(item =>
                price += item.price * item.count
            );
            setToralPrice(price)
            setMyCartList(cartList);
        }
        deneme();
    }, [myCartList])

    React.useEffect(() => {
        
    }, [])

    async function placeOrder() {
        let token = await AsyncStorage.getItem("accessToken");
        token = JSON.parse(token);
        let details=[];
        let restId = await AsyncStorage.getItem("restaurantId");
        let tableId = await AsyncStorage.getItem("tableId");
        let orders = await AsyncStorage.getItem("item");
        orders = JSON.parse(orders);
        orders.forEach((element, index, array) => {
            details.push({"id":element.id,"price":element.price,"count":element.count})
        })
        console.log(JSON.stringify(details));

        axios({
            method: 'post',
            url: Route.host + '/orders',
            data: {
                details: JSON.stringify(details),
                order_id: uuid(),
                user_id: parseInt(token.uid),
                rest_id: parseInt(restId),
                table_id: 5,
                order_status: "To do",
            }
        }).then((response) => {
            //set the returned orderId to orderId
            console.log(response);
        }, (error) => {
            console.log(error);
        });
    }

    async function getOrderStatus() {
        let restId = await AsyncStorage.getItem("restaurantId");
        axios({
            method: 'get',
            url: Route.host + '/restaurants/' + restId + '/orders/' + orderId
        }).then((response) => {
            //set the returned order status to orderStatus
            console.log(response);
            setOrderStatus(response);
        }, (error) => {
            console.log(error);
        });
    }

    async function updateQuantityHandler(newQty, id) {
        if (newQty < 1) {
            await deleteItem(id);
            return;
        }
        let newMyCartList = myCartList.map(cl => (
            cl.id === id ? { ...cl, count: newQty } : cl
        ))
        setMyCartList(newMyCartList)
        let cartList = await AsyncStorage.getItem("item");
        let cartItems = await JSON.parse(cartList);
        for (var i = 0; i < cartItems.length; i++) {
            if (cartItems[i].id === id) {
                cartItems[i].count = newQty
            }
        }
        await AsyncStorage.setItem(
            "item",
            JSON.stringify(cartItems),
        );
    }

    async function deleteItem(id) {
        cartList = await AsyncStorage.getItem("item");
        let cartItems = await JSON.parse(cartList);
        cartItems = cartItems.filter(function (ci) {
            return ci.id !== id;
        });
        await AsyncStorage.setItem(
            "item",
            JSON.stringify(cartItems),
        );
        setMyCartList(cartItems);
    }

    function renderCartList() {
        return (
            <SwipeListView
                data={myCartList}
                keyExtractor={item => `${item.prod_id}`}
                contentContainerStyle={{
                    marginTop: SIZES.radius,
                    paddingHorizontal: SIZES.padding,
                    paddingBottom: SIZES.padding * 2
                }}
                disableRightSwipe={true}
                rightOpenValue={-75}
                renderItem={(data, rowMap) => (
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
                            <Image
                                source={{ uri: data.item.prod_image }}
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
                onPress={() => navigation.navigate("Home")}
            />
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <HeaderOrder navigation={navigation}></HeaderOrder>
            <View
                style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
            >
                <Text style={{ ...FONTS.h2 }}>My Cart</Text>
                <Text style={{ ...FONTS.h4 }}>Order Status</Text>
            </View>
            {/* Cart */}
            {renderCartList()}

            {/* Footer */}
            {renderFooter()}
            <PrimaryButton
                onPress={() => placeOrder()}
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
import React from 'react';
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

import { StepperInput, FooterTotal, HeaderInside } from '../../components';
import { FONTS, SIZES, COLORS, icons } from "../../constants"

const Cart = ({ navigation }) => {

    // AsyncStorage.clear();
    const [myCartList, setMyCartList] = React.useState([])
    const [totalPrice, setToralPrice] = React.useState(0);

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
                keyExtractor={item => `${item.id}`}
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
                                source={{ uri: data.item.image }}
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
                            <Text style={{ ...FONTS.body3 }}>{data.item.name}</Text>
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
                            onAdd={() => { updateQuantityHandler(data.item.count + 1, data.item.id) }}
                            onMinus={() => { updateQuantityHandler(data.item.count - 1, data.item.id) }}
                        />
                        <TouchableHighlight
                            onPress={() => { deleteItem(data.item.id) }}>
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
            <HeaderInside navigation={navigation}></HeaderInside>
            <View
                style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
            >
                <Text style={{ ...FONTS.h2 }}>My Cart</Text>
            </View>
            {/* Cart */}
            {renderCartList()}

            {/* Footer */}
            {renderFooter()}
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
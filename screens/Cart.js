import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { SwipeListView } from 'react-native-swipe-list-view';
import Header from '../components/Header';
import IconButton from '../components/IconButton';
import StepperInput from '../components/StepperInput';
import CartQuantityButton from '../components/CartQuantityButton';
import FooterTotal from '../components/FooterTotal';
import { FONTS, SIZES, COLORS, icons, dummyData } from "../constants"
import HeaderInside from '../components/HeaderInside';
import { LogBox } from 'react-native';
const Cart = ({ navigation }) => {

    const [myCartList, setMyCartList] = React.useState([])
    const [storage, setStorage] = React.useState("");
    const [totalPrice, setToralPrice] = React.useState(0);

    let price = 0
    let cartList = [];

    React.useEffect(() => {
        async function deneme(){
            cartList = await AsyncStorage.getItem("item")
            cartList = JSON.parse(cartList);
            console.log("cartList", cartList, typeof(cartList))
            cartList.forEach(item => 
                price += item.price * item.count
            );
            setToralPrice(price)
            setMyCartList(cartList);
        }
        deneme();
    },[])

    function updateQuantityHandler(newQty, id) {
        let newMyCartList = myCartList.map(cl => (
            cl.id === id ? { ...cl, count: newQty } : cl
        ))
        setMyCartList(newMyCartList)
    }

    function removeMyCartHandler(id) {
        let newMyCartList = [...myCartList]

        let index = newMyCartList.findIndex(cart => cart.id == id)

        newMyCartList.splice(index, 1)

        setMyCartList(newMyCartList)
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
                                source={{uri:data.item.image}}
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
                            onAdd={() => updateQuantityHandler(data.item.count + 1, data.item.id)}
                            onMinus={() => { updateQuantityHandler(data.item.count - 1, data.item.id)}}
                        />
                        <View
                            style={{
                                width: 30,
                                height:30,
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
        <View
            style={{
                flex: 1,
                backgroundColor: COLORS.white
            }}
        >
            {/* Header */}
            <HeaderInside navigation={navigation}></HeaderInside>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{  ...FONTS.h2}}>My Cart</Text>
            </View>
            {/* Cart */}
            {renderCartList()}

            {/* Footer */}
            {renderFooter()}
        </View>
    )
}

const styles = StyleSheet.create({
    cartItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: SIZES.radius,
        paddingHorizontal: SIZES.radius,
        borderRadius: SIZES.radius,
    },
});

export default Cart;
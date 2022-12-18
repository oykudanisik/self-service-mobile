import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { icons, images, SIZES, COLORS, FONTS, dummyData } from '../constants'
import Header from '../components/Header';
import StepperInput from '../components/StepperInput';
const Cart = ({ navigation }) => {

    const [myCartList, setMyCartList] = React.useState(dummyData.myCart)

    // Handler

    function updateQuantityHandler(newQty, id) {
        let newMyCartList = myCartList.map(cl => (
            cl.id === id ? { ...cl, qty: newQty } : cl
        ))

        setMyCartList(newMyCartList)
    }

    function removeMyCartHandler(id) {
        let newMyCartList = [...myCartList]

        let index = newMyCartList.findIndex(cart => cart.id == id)

        newMyCartList.splice(index, 1)

        setMyCartList(newMyCartList)
    }

    // Render
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
                            backgroundColor: COLORS.lightGray2,
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
                                source={data.item.image}
                                resizeMode="contain"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    position: 'absolute',
                                    top: 10,
                                }}
                            />
                        </View>

                        {/* Food Info */}
                        <View
                            style={{
                                flex: 1,
                            }}
                        >
                            <Text style={{ ...FONTS.body3 }}>{data.item.name}</Text>
                            <Text style={{ color: COLORS.primary, ...FONTS.h3 }}>${data.item.price}</Text>
                        </View>

                        {/* Quantity */}
                        <StepperInput
                            containerStyle={{
                                height: 50,
                                width: 150,
                                backgroundColor: COLORS.white
                            }}
                            value={data.item.qty}
                        />
                    </View>
                )}
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
            <Header></Header>
            {/* Cart */}
            {renderCartList()}
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
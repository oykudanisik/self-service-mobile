import React from 'react';
import axios from 'axios';
import {
    View,
    Text,
    Image,
    SafeAreaView,
    StyleSheet,
    LinearGradient
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Route from "../../routes/Route";
import { FONTS, SIZES, COLORS, icons, images, dummyData } from "../../constants"
import validation from "../../validation/Validation";

import {
    Header,
    IconButton,
    HeaderOrder,
    CardItem,
    FooterTotal,
    PrimaryButton
} from "../../components"
import { order } from '../../constants/icons';

const Pay = ({ navigation, route }) => {

    const [selectedCard, setSelectedCard] = React.useState(null)
    const [order, setOrder] = React.useState([{}]);
    const [totalPrice, setTotalPrice] = React.useState(0);

    async function getOrderTotal() {
        let restId = await AsyncStorage.getItem("restaurantId");
        console.log(restId);
        axios({
            method: 'get',
            url: Route.host + '/users/' + restId + '/orders?status=done'
        }).then((response) => {
            //set the returned order status to orderStatus
            setOrder(response.data.items)
            console.log(response.data.items)
            let price = 0;
            response.data.items.map(item =>
                price += item.price
            )
            setTotalPrice(price)
        }, (error) => {
            setOrder([{}])
            console.log(error);
        });
    }
    React.useEffect(() => {
        let { selectedCard } = route.params
        setSelectedCard(selectedCard)
        getOrderTotal()

    }, [])

    // Handler

    function selectCardHandler(item) {
        console.log(item)
        setSelectedCard(item)
    }

    // Render

    function renderMyCards() {
        return (
            <View>
                {dummyData.myCards.map((item, index) => {
                    return (
                        <CardItem
                            key={`MyCard-${item.id}`}
                            item={item}
                            isSelected={`${selectedCard?.key}-${selectedCard?.id}` == `MyCard-${item.id}`}
                            onPress={() => selectCardHandler({ ...item, key: "MyCard" })}
                        />
                    )
                })}
            </View>
        )
    }
    function renderOrderDetails() {
        return (
            <View>
                <View
                    style={{
                        padding: SIZES.padding,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        backgroundColor: COLORS.white
                    }}
                >
                    {
                        order.map(({ order_status, prod_name, order_item_id, price, quantity }) => {
                            return (
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        marginTop: SIZES.padding,
                                        paddingBottom: SIZES.padding
                                    }}
                                >
                                    <Text style={{ flex: 1, ...FONTS.h2 }}>{prod_name}</Text>
                                    <Text style={{ ...FONTS.h2 }}>{price}</Text>
                                </View>
                            )
                        })
                    }
                </View>
            </View>
        )
    }
    function renderFooter() {
        return (
            <FooterTotal
                subTotal={37.97}
                shippingFee={0.00}
                total={totalPrice}
                onPress={() => navigation.replace("Success")}
            />
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <HeaderOrder navigation={navigation}></HeaderOrder>

            {/* Cards */}
            <KeyboardAwareScrollView
                keyboardDismissMode="on-drag"
                extraScrollHeight={-200}
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingHorizontal: SIZES.padding,
                    paddingBottom: 20
                }}
            >
                {/* My Cards */}
                {renderMyCards()}
                {renderOrderDetails()}
            </KeyboardAwareScrollView>

            {/* Footer */}
            {renderFooter()}
            <PrimaryButton
                onPress={() => placeOrder()}
                title="PAY"
            />
        </SafeAreaView>
    )
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

export default Pay;
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
    PrimaryButton,
    FormInput,
    FormInputCheck,
    RadioButton
} from "../../components"
import { order } from '../../constants/icons';

const Pay = ({ navigation, route }) => {
    const [cardNumber, setCardNumber] = React.useState("")
    const [cardNumberError, setCardNumberError] = React.useState("")
    const [cardName, setCardName] = React.useState("")
    const [cardNameError, setCardNameError] = React.useState("")
    const [expiryDate, setExpiryDate] = React.useState("")
    const [expiryDateError, setExpiryDateError] = React.useState("")
    const [cvv, setCvv] = React.useState("")
    const [cvvError, setCvvError] = React.useState("")
    const [selectedCard, setSelectedCard] = React.useState(null)
    const [order, setOrder] = React.useState([{}]);
    const [totalPrice, setTotalPrice] = React.useState(0);
    const [isRemember, setIsRemember] = React.useState(false)


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
                price += item.price * item.count
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


    function renderOrderDetails() {
        return (
            <View>
                <View
                    style={{
                        padding: SIZES.padding,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        top:100
                    }}
                >
                    {
                        order.map(({ order_status, prod_name, order_item_id, price, count }) => {
                            return (
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        marginTop: SIZES.padding,
                                        paddingBottom: SIZES.padding
                                    }}
                                >
                                    <Text style={{ flex: 1, ...FONTS.h4 }}>{prod_name}</Text>
                                    <Text style={{ ...FONTS.h4 }}>{price*count} TL</Text>
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
    function renderForm() {
        return (
            <View
                style={{
                    marginTop: SIZES.padding * 2
                }}
            >
                {/* Card Number */}
                <FormInput
                    label="Card Number"
                    keyboardType="number-pad"
                    maxLength={19}
                    value={cardNumber}
                    onChange={(value) => {
                        setCardNumber(value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim())
                        validation.validateInput(value, 19, setCardNumberError)
                    }}
                    errorMsg={cardNumberError}
                    appendComponent={
                        <FormInputCheck
                            value={cardNumber}
                            error={cardNumberError}
                        />
                    }
                />

                {/* Cardholder Name */}
                <FormInput
                    label="Cardholder Name"
                    value={cardName}
                    containerStyle={{
                        marginTop: SIZES.radius,
                        
                    }}
                    onChange={(value) => {
                        validation.validateInput(value, 1, setCardNameError)
                        setCardName(value)
                    }}
                    errorMsg={cardNameError}
                    appendComponent={
                        <FormInputCheck
                            value={cardName}
                            error={cardNameError}
                            
                        />
                    }
                />

                {/* Expiry Date / CVV */}
                <View
                    style={{
                        flexDirection: 'row',
                        marginTop: SIZES.radius
                    }}
                >
                    <FormInput
                        label="Expiry Date"
                        value={expiryDate}
                        placeholder="MM/YY"
                        maxLength={5}
                        containerStyle={{
                            flex: 1
                            
                        }}
                        onChange={(value) => {
                            validation.validateInput(value, 5, setExpiryDateError)
                            setExpiryDate(value)
                        }}
                        appendComponent={
                            <FormInputCheck
                                value={expiryDate}
                                error={expiryDateError}
                            />
                        }
                    />

                    <FormInput
                        label="CVV"
                        value={cvv}
                        maxLength={3}
                        containerStyle={{
                            flex: 1,
                            marginLeft: SIZES.radius
                        }}
                        onChange={(value) => {
                            validation.validateInput(value, 3, setCvvError)
                            setCvv(value)
                        }}
                        appendComponent={
                            <FormInputCheck
                                value={cvv}
                                error={cvvError}
                            />
                        }
                    />
                </View>

                {/* Remember */}
                <View
                    style={{
                        alignItems: 'flex-start',
                        marginTop: SIZES.padding*2.5
                    }}
                >
                    <RadioButton
                        label="Remember this card details."
                        isSelected={isRemember}
                        onPress={() => setIsRemember(!isRemember)}
                    />
                </View>
            </View>
        )
    }


    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <HeaderOrder navigation={navigation}></HeaderOrder>

            {/* Card */}
            <KeyboardAwareScrollView
                keyboardDismissMode="on-drag"
                extraScrollHeight={-200}
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingHorizontal: SIZES.padding,
                    paddingBottom: 20
                }}
            >
                {renderForm()}
                {renderOrderDetails()}
            </KeyboardAwareScrollView>

            {/* Footer */}
            {renderFooter()}
            <PrimaryButton
                onPress={() => navigation.navigate("Pay", { selectedCard: selectedCard })}
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
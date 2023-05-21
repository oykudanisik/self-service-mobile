import React from 'react';
import axios from 'axios';
import {
    View,
    Text,
    Image,
    SafeAreaView,
    StyleSheet,
    LinearGradient,
    RefreshControl,

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
    const [tip, setTip] = React.useState("")
    const [waiterId, setWaiterId] = React.useState("")
    const [order, setOrder] = React.useState([{}]);
    const [totalPrice, setTotalPrice] = React.useState(0);
    const [isRemember, setIsRemember] = React.useState(false)
    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
            getOrderTotal()
        }, 2000);
    }, []);

    async function updateOrders() {
        let token = await AsyncStorage.getItem("accessToken");
        token = JSON.parse(token);
        let restId = await AsyncStorage.getItem("restaurantId");
        order.map(item =>
            axios({
                method: 'post',
                url: Route.host + '/restaurants/orders/alter',
                data: {
                    order_status: "paid",
                    rest_id: parseInt(restId),
                    order_item_id: item.order_item_id
                }
            }).then((response) => {
            }, (error) => {
            })
        )

    }
    async function getOrderTotal() {
        let accessToken = await AsyncStorage.getItem("accessToken");
        let restId = await AsyncStorage.getItem("restaurantId");
        let userId = JSON.parse(accessToken)

        axios({
            method: 'get',
            url: Route.host + '/users/orders?userId=' + userId.uid + '&resId=' + restId + '&status=done'
        }).then((response) => {
            // set the returned order status to orderStatus
            setOrder(response.data.data)
            let price = 0;
            response.data.data.map(item =>
                price += item.price * item.prod_count
            )
            setTotalPrice(price)
        }, (error) => {
            setOrder([{}])
        });
    }
    async function getTableWaiter() {
        let accessToken = await AsyncStorage.getItem("accessToken");
        let restId = await AsyncStorage.getItem("restaurantId");
        let tableId = await AsyncStorage.getItem("tableId");
        let userId = JSON.parse(accessToken)
        axios({
            method: 'get',
            url: Route.host + '/restaurants/tables/waiters?resId=' + restId + '&tableId=' + tableId
        }).then((response) => {
            // set the returned order status to orderStatus
            setOrder(response.data.items)
            setWaiterId(response.data.items[0].waiter_id);
            let price = 0;
            response.data.items.map(item =>
                price += item.price * item.prod_count
            )
            setTotalPrice(price)
            tips(response.data.items[0].waiter_id, restId, userId);

        }, (error) => {
            setOrder([{}])
        });
    }

    async function tipWaiter() {
        await getTableWaiter();
    }

    async function tips(waiter_id, restId, userId) {
        console.log("x", parseInt(restId))
        console.log("y", parseInt(userId.uid))
        console.log("z", parseInt(waiter_id))
        console.log("w", tip)
        axios({
            method: 'post',
            url: Route.host + '/restaurants/waiters/tips',
            data: {
                rest_id: parseInt(restId),
                user_id: parseInt(userId.uid),
                waiter_id: parseInt(waiter_id),
                tip: parseInt(tip)
            }
        }).then((response) => {
        }, (error) => {
            console.log(error);
        })
    }
    function isExpiryDateValid(expiryDate) {
        // Check if the input is in the 'MM/YY' format using a regular expression
        const validFormat = /^\d{2}\/\d{2}$/.test(expiryDate);

        if (!validFormat) {
            return false; // Invalid format
        }

        const currentDate = new Date();
        const [month, year] = expiryDate.split('/');

        // Get the current year's last two digits
        const currentYear = currentDate.getFullYear() % 100;

        // Convert the two-digit year to a four-digit year
        const expiryYear = parseInt(year) + 2000;

        // Convert the expiry date to a JavaScript Date object
        const expiry = new Date(expiryYear, parseInt(month) - 1, 1);

        // Compare the expiry date with the current date
        if (expiry < currentDate || expiryYear < currentYear) {
            return false; // Expiry date has passed
        }

        return true; // Expiry date is valid
    }
    React.useEffect(() => {
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
                        top: 40
                    }}
                >
                    <Text style={{ ...FONTS.h4 }}>Waiting to be Paid</Text>

                    {
                        order.map(({ prod_name, price, prod_count }) => {
                            return (
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        marginTop: SIZES.padding,
                                        paddingBottom: SIZES.padding
                                    }}
                                >
                                    <Text style={{ flex: 1, ...FONTS.h5 }}>{prod_name}</Text>
                                    <Text style={{ ...FONTS.h5 }}>{price * prod_count} TL</Text>
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
            // onPress={() => navigation.replace("Success")}
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
                            if (/^[0-9/]*$/.test(value)) { // Check if the value contains only numbers and '/'
                                validation.validateInput(value, 5, setExpiryDateError);
                                setExpiryDate(value);
                                if (!isExpiryDateValid(value)) {
                                    console.log("eski")
                                }
                            }
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
                        keyboardType="number-pad"

                        containerStyle={{
                            flex: 1,
                            marginLeft: SIZES.radius
                        }}
                        onChange={(value) => {
                            if (!isNaN(value)) {
                                validation.validateInput(value, 3, setCvvError)
                                setCvv(value)
                            }

                        }}
                        appendComponent={
                            <FormInputCheck
                                value={cvv}
                                error={cvvError}
                            />
                        }
                    />
                </View>

                <FormInput
                    label="Tip to waiter"
                    value={tip}
                    keyboardType="number-pad"
                    containerStyle={{
                        flex: 1,
                        paddingTop: 20
                    }}
                    onChange={(value) => {
                        setTip(value)
                    }}
                />
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
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {renderForm()}
                {renderOrderDetails()}
            </KeyboardAwareScrollView>

            {/* Footer */}
            {renderFooter()}
            <PrimaryButton
                onPress={() => {
                    if (cardNumberError === "" && cardNameError === "" && expiryDateError === "" && cvvError === "" &&
                        cardNumber !== "" && cardName !== "" && expiryDate !== "" && cvv !== "") {
                        navigation.navigate("Loading")
                        updateOrders();
                        if (tip === "" || tip <= 0) {
                            tipWaiter()
                        }
                    }
                }}
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
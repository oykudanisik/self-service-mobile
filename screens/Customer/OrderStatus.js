import React, { useMemo, useState, useEffect, useCallback } from 'react';
import {
    Animated,
    Image,
    SafeAreaView,
    StyleSheet,
    View,
    Text,
} from 'react-native';
import { HeaderOrder } from '../../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Route from '../../routes/Route';

// constants
import { images, SIZES, COLORS, FONTS, icons } from '../../constants'

const OrderStatus = ({ navigation }) => {

    const [orderStatus, setOrderStatus] = React.useState("");
    async function getOrderStatus() {
        let token = await AsyncStorage.getItem("accessToken");
        token = JSON.parse(token);
        console.log((token.uid));
        axios({
            method: "get",
            url: Route.host + '/users/' + parseInt(token.uid) + '/orders',
        }).then(function (response) {
            console.log(response.data.items);
            setOrderStatus(response.data.items[2].order_status);
        });
    }

    useEffect(() => {
        getOrderStatus();
    }, [])

    function renderContent() {
        return (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Image
                    source={images.waiter}
                    resizeMode="cover"
                    style={{
                        width: "60%",
                        height: "80%",
                    }}
                />

                <Text style={{ fontSize: 20 }}>{orderStatus}</Text>

            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>

            <HeaderOrder navigation={navigation}></HeaderOrder>

            <View>
                {renderContent()}
            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.lightGray
    },
});

export default OrderStatus;

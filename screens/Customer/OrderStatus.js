import React, { useMemo, useState, useEffect, useCallback } from 'react';
import {
    Animated,
    Image,
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    FlatList,
    TouchableOpacity

} from 'react-native';
import { HeaderOrder } from '../../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Route from '../../routes/Route';
// constants
import { images, SIZES, COLORS, FONTS, icons } from '../../constants'

const OrderStatus = ({ navigation }) => {

    const [orderStatus, setOrderStatus] = React.useState();
    const [order, setOrder] = React.useState();

    async function getOrderStatus() {
        let token = await AsyncStorage.getItem("accessToken");
        console.log(token);
        token = JSON.parse(token);
        axios({
            method: "get",
            url: Route.host + '/users/' + parseInt(token.uid) + '/orders',
        }).then(function (response) {
            setOrder(response.data.items)
            console.log(response.data.items)
        });
    }

    useEffect(() => {
        getOrderStatus();
        // const interval = setInterval(() => {
        //     getOrderStatus();
        //   }, 10000);
        //   return () => clearInterval(interval);
    }, [])

    function renderContent() {
        const renderItem = ({ item }) => (
            <TouchableOpacity
                style={{
                    marginBottom: SIZES.padding * 2,
                    width: "50%",
                    margin: 10
                }}
            >
                {/* Image */}
                <View
                    style={{
                        marginBottom: SIZES.padding
                    }}
                >
                    <Image
                        source={images.waiter}
                        resizeMode="cover"
                        style={{
                            width: "75%",
                            height: 300,
                            borderRadius: SIZES.radius
                        }}
                    />
                </View>

                {/* Status Info */}
                <Text style={{ ...FONTS.body3 }}>{item.prod_name} x{item.quantity}</Text>
                <Text style={{ ...FONTS.body2 }}>{item.order_status}</Text>
            </TouchableOpacity>
        )

        return (
            <FlatList
                data={order}
                keyExtractor={item => `${item.order_item_id}`}
                renderItem={renderItem}
                contentContainerStyle={{
                    paddingHorizontal: SIZES.padding * 2,
                    paddingBottom: 30,
                }}
                numColumns={2}
            />
        )
    }
    return (
        <SafeAreaView style={styles.container}>
            <HeaderOrder navigation={navigation}></HeaderOrder>
            {renderContent()}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.lightGray5
    },
    inputContainer: {
        flex: 1,
        height: 50,
        borderRadius: 10,
        flexDirection: 'row',
        backgroundColor: COLORS.light,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 1,
    }
})


export default OrderStatus;

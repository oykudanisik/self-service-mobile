import React from "react";
import { useEffect, useState } from "react";
import axios from 'axios';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList,
    TextInput
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dialog } from '@rneui/themed';
import { icons, images, SIZES, COLORS, FONTS } from '../../constants'
import { Header } from '../../components';
import Route from "../../routes/Route";

const Tables = ({ navigation, route }) => {
    const [tables, setTables] = React.useState([{}]);
    const [tableOrders, setTableOrders] = React.useState([{}]);
    const [visible2, setVisible2] = useState(false);

    const toggleDialog2 = () => {
        setVisible2(!visible2);
    };
    async function getWaiterTables() {
        let token = await AsyncStorage.getItem("accessToken");
        token = JSON.parse(token);
        axios({
            method: "get",
            url: Route.host + '/restaurants/waiters/tables/?resId=' + token.rest_id +'&waiterId=' +token.uid
        }).then(function (response) {
            setTables(response.data.items)
        });
    }
   async function getTableOrderDetails(table_id) {
        let token = await AsyncStorage.getItem("accessToken");
        token = JSON.parse(token);
        toggleDialog2()
        console.log(token.rest_id);
        console.log(table_id);

        axios({
            method: "get",
            url: Route.host + '/restaurants/tables/orders/?resId=' + token.rest_id +'&tableId=' + table_id
        }).then(function (response) {
            console.log(response.data.orders)
            setTableOrders(response.data.orders)
        }, (error) => {
            setTableOrders([{}])
        });
    }
    async function updateOrders(orderId) {
        let token = await AsyncStorage.getItem("accessToken");
        token = JSON.parse(token);
        console.log(parseInt(token.rest_id)),
            console.log(orderId)
        axios({
            method: 'post',
            url: Route.host + '/restaurants/orders/alter',
            data: {
                order_status: "done",
                rest_id: 1,
                order_item_id: orderId
            }
        }).then((response) => {
        }, (error) => {
            console.log(error);
        });
    }

    useEffect(() => {
        getWaiterTables()
    }, []);


    function renderRestaurantList() {
        const renderItem = ({ item }) => (
            <TouchableOpacity
                style={{
                    marginTop: SIZES.padding * 3,
                    width: "45%",
                    margin: 10
                }}
                onPress={() => {
                    getTableOrderDetails(item.table_no)
                }}
            >
                {/* Image */}
                <View
                    style={{
                        marginBottom: SIZES.padding
                    }}
                >
                    <Image
                        source={images.table}
                        resizeMode="cover"
                        style={{
                            width: "95%",
                            height: 180,
                            borderRadius: SIZES.radius
                        }}
                    />

                    <View
                        style={{
                            position: 'absolute',
                            top: "100%",
                            right: "32%",
                            height: 40,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Text style={{ ...FONTS.body2 }}>Table {item.table_no}</Text>

                    </View>

                </View>
                <Dialog
                    isVisible={visible2}
                    onBackdropPress={toggleDialog2}
                >
                    <Dialog.Title title="Order Details of the Table" />
                    {
                        tableOrders.map(({ order_status, prod_name, order_item_id }) => {
                            return (
                                <View>
                                    <Text>{prod_name}</Text>
                                    <Text>Order Status: {order_status}</Text>
                                    <Dialog.Actions>
                                        {order_status == "Completed" ?
                                            <Dialog.Button title="DONE" onPress={() =>
                                                updateOrders(order_item_id)
                                            } />
                                        : ""}
                                    </Dialog.Actions>
                                </View>
                            )
                        })
                    }
                </Dialog>
            </TouchableOpacity>

        )

        return (
            <FlatList
                data={tables}
                keyExtractor={item => `${item.table_no}`}
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
            <Header navigation={navigation}></Header>
            {renderRestaurantList()}
        </SafeAreaView>
    )
}

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

export default Tables
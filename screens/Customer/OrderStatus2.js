import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    LayoutAnimation,
    StyleSheet,
    UIManager,
    Platform,
    ScrollView,
    TouchableHighlight,
    Image
} from "react-native";

import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { icons, images, SIZES, COLORS, FONTS } from '../../constants'
import Route from "../../routes/Route";
import { HeaderOrder, PrimaryButton } from '../../components';

const Accordion = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(true);


    const toggleOpen = () => {
        // setIsOpen(value => !value);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }

    return (
        <>
            <TouchableOpacity onPress={toggleOpen} style={styles.heading} activeOpacity={0.6}>
                {title}
            </TouchableOpacity>
            <View style={[styles.list, !isOpen ? styles.hidden : undefined]}>
                {children}
            </View>
        </>
    );
};

const OrderStatus2 = ({ navigation }) => {

    const [tables, setTables] = React.useState([{}]);
    const [tableOrders, setTableOrders] = React.useState([{}]);
    const [todoOrders, setTodoOrders] = useState([{}])
    const [inprogressOrders, setInprogressOrders] = useState([{}])
    const [completedOrders, setCompletedOrders] = useState([{}])
    const [visible2, setVisible2] = useState(false);
    let todo = [];
    let inprogress = [];
    let completed = [];
    const toggleDialog2 = () => {
        setVisible2(!visible2);
    };

    async function getOrderStatus() {
        let token = await AsyncStorage.getItem("accessToken");
        token = JSON.parse(token);
        let restId = await AsyncStorage.getItem("restaurantId");

        console.log(token.uid);
        console.log(restId);

        axios({
            method: "get",
            url: Route.host + '/users/orders?userId=' + token.uid + '&resId=' + restId,
        }).then(function (response) {
            console.log("xxxxxx", response.data.data)
            response.data.data.map((x) => {
                if (x.order_status == "To do") {
                    todo.push(x);
                }
                if (x.order_status == "In progress") {
                    inprogress.push(x);
                }
                if (x.order_status == "Completed") {
                    completed.push(x);
                }
            })
            console.log(todo);
            setTodoOrders(todo);
            setInprogressOrders(inprogress);
            setCompletedOrders(completed)
            setTableOrders(response.data.orders)
        });
    }


    useEffect(() => {
        getOrderStatus();
    }, []);

    const todoTitle = (
        <View>
            <Text style={{ ...FONTS.h4 }} >To do</Text>
        </View>
    )

    const inProgressTitle = (
        <View>
            <Text style={{ ...FONTS.h4 }} >In Progress</Text>
        </View>
    )
    const completedTitle = (
        <View>
            <Text style={{ ...FONTS.h4 }} >Completed</Text>
        </View>
    )
    return (
        <SafeAreaProvider>

            <ScrollView>
                <SafeAreaView style={styles.safeArea}>
                <HeaderOrder navigation={navigation} ></HeaderOrder>
                    <View style={styles.container}>
                        <Text style={{ ...FONTS.h2, paddingBottom: 20, paddingTop:20 }}>Status of my Orders </Text>
                        <View style={{ alignItems: 'center' }} ><View style={styles.divider} /></View>
                        <Accordion title={completedTitle} >
                            {
                                completedOrders.map(({ order_status, prod_name, order_item_id, table_id, prod_count }) => {
                                    return (
                                        <TouchableHighlight onPress={() => updateOrders(order_item_id)}>
                                            <View
                                                style={{
                                                    width: "95%",
                                                    height: 30,
                                                    marginLeft: 10
                                                }}
                                            >
                                                <Text>{prod_name} x{prod_count}</Text>
                                            </View>
                                        </TouchableHighlight>
                                    )
                                })
                            }
                        </Accordion>
                        <View style={{ alignItems: 'center' }} ><View style={styles.divider} /></View>
                        <Accordion title={inProgressTitle} >
                            {
                                inprogressOrders.map(({ order_status, prod_name, order_item_id, table_id, prod_count }) => {
                                    return (
                                        <View>
                                            <View
                                                style={{
                                                    width: "95%",
                                                    height: 30,
                                                    marginLeft: 10
                                                }}
                                            >
                                                <Text>{prod_name} x{prod_count}</Text>
                                            </View>
                                        </View>
                                    )
                                })
                            }
                        </Accordion>
                        <View style={{ alignItems: 'center' }} ><View style={styles.divider} /></View>
                        <Accordion title={todoTitle} >
                            {
                                todoOrders.map(({ order_status, prod_name, order_item_id, table_id, prod_count }) => {
                                    return (
                                        <View >
                                            <View
                                                style={{
                                                    width: "95%",
                                                    height: 30,
                                                    marginLeft: 10
                                                }}
                                            >
                                                <Text>{prod_name} x{prod_count}</Text>
                                            </View>
                                        </View>
                                    )
                                })
                            }
                        </Accordion>
                        <View style={{ alignItems: 'center' }} ><View style={styles.divider} /></View>

                    </View>
                </SafeAreaView>
              
            </ScrollView>
            <PrimaryButton
                onPress={() => navigation.navigate("Pay")}
                title="PAY"
            />
        </SafeAreaProvider>

    );
};

export default OrderStatus2;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        paddingVertical: 30,
    },
    text: {
        fontSize: 18,
        marginBottom: 20,
    },
    safeArea: {
        flex: 1,
    },
    heading: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10
    },
    hidden: {
        height: 0,
    },
    list: {
        overflow: 'hidden'
    },
    sectionTitle: {
        fontSize: 16,
        height: 30,
        marginLeft: '5%',
    },
    sectionDescription: {
        fontSize: 12,
        height: 30,
        marginLeft: '5%',
    },
    divider: {
        borderBottomColor: 'grey',
        borderBottomWidth: StyleSheet.hairlineWidth,
        width: '100%',
    },
});
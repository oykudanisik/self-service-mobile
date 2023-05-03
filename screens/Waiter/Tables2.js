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
import { Header } from '../../components';

import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dialog } from '@rneui/themed';
import axios from 'axios';
import { icons, images, SIZES, COLORS, FONTS } from '../../constants'
import Route from "../../routes/Route";

const Accordion = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);


    const toggleOpen = () => {
        setIsOpen(value => !value);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }

    return (
        <>
            <TouchableOpacity onPress={toggleOpen} style={styles.heading} activeOpacity={0.6}>
                {title}
                <Icon name={isOpen ? "chevron-up-outline" : "chevron-down-outline"} size={18} color="black" />
            </TouchableOpacity>
            <View style={[styles.list, !isOpen ? styles.hidden : undefined]}>
                {children}
            </View>
        </>
    );
};

const Tables2 = ({ navigation }) => {

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
    async function getWaiterTables() {
        let token = await AsyncStorage.getItem("accessToken");
        token = JSON.parse(token);
        axios({
            method: "get",
            url: Route.host + '/restaurants/waiters/tables/?resId=' + token.rest_id + '&waiterId=' + token.uid
        }).then(function (response) {
            setTables(response.data.items)
            response.data.items.map(({ rest_id, table_no }) => {
                getTableOrderDetails(table_no)
            })
        });
    }
    async function getTableOrderDetails(table_id) {
        let token = await AsyncStorage.getItem("accessToken");
        token = JSON.parse(token);
        toggleDialog2()

        axios({
            method: "get",
            url: Route.host + '/restaurants/tables/orders/?resId=' + token.rest_id + '&tableId=' + table_id
        }).then(function (response) {
            response.data.orders.map((x) => {
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
        }, (error) => {
            setTableOrders([{}])
        });
    }
    async function updateOrders(orderId) {
        let token = await AsyncStorage.getItem("accessToken");
        token = JSON.parse(token);
        axios({
            method: 'post',
            url: Route.host + '/restaurants/orders/alter',
            headers: {
                Authorization: "Bearer <" + token + ">"
            },
            data: {
                order_status: "done",
                rest_id: 1,
                order_item_id: orderId
            }
            
        }).then((response) => {
            getWaiterTables()
        }, (error) => {
            console.log(error);
        });
    }

    useEffect(() => {
        getWaiterTables();

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
                    <Header navigation={navigation}></Header>
                    <View style={styles.container}>
                        <Text style={{ ...FONTS.h2, paddingBottom: 20 }}>Order Details of My Tables</Text>
                        <View style={{ alignItems: 'center' }} ><View style={styles.divider} /></View>
                        <Accordion title={completedTitle} >
                            {
                                completedOrders.map(({ order_status, prod_name, order_item_id, table_id }) => {
                                    return (
                                        <TouchableHighlight onPress={() => updateOrders(order_item_id)}>
                                            <View
                                                style={{
                                                    width: "95%",
                                                    height: 30,
                                                    marginLeft: 10
                                                }}
                                            >
                                                <Text>{prod_name} / Table {table_id}</Text>
                                                <Image
                                                    source={icons.check_mark}
                                                    onPress={() => updateOrders(order_item_id)}
                                                    resizeMode="contain"
                                                    style={{
                                                        width: "65%",
                                                        height: "65%",
                                                        position: 'absolute',
                                                        left: 250
                                                    }}
                                                />
                                            </View>
                                        </TouchableHighlight>
                                    )
                                })
                            }
                        </Accordion>
                        <View style={{ alignItems: 'center' }} ><View style={styles.divider} /></View>
                        <Accordion title={inProgressTitle} >
                            {
                                inprogressOrders.map(({ order_status, prod_name, order_item_id, table_id }) => {
                                    return (
                                        <View>
                                            <View
                                                style={{
                                                    width: "95%",
                                                    height: 30,
                                                    marginLeft: 10
                                                }}
                                            >
                                                <Text>{prod_name} / Table {table_id}</Text>

                                            </View>
                                        </View>
                                    )
                                })
                            }
                        </Accordion>
                        <View style={{ alignItems: 'center' }} ><View style={styles.divider} /></View>
                        <Accordion title={todoTitle} >
                            {
                                todoOrders.map(({ order_status, prod_name, order_item_id, table_id }) => {
                                    return (
                                        <View >
                                            <View
                                                style={{
                                                    width: "95%",
                                                    height: 30,
                                                    marginLeft: 10
                                                }}
                                            >
                                                <Text>{prod_name} / Table {table_id}</Text>
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
        </SafeAreaProvider>

    );
};

export default Tables2;

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
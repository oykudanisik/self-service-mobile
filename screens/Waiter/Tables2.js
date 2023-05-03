import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    LayoutAnimation,
    StyleSheet,
    UIManager,
    Platform
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
    const [tables, setTables] = React.useState([{}]);
    const [tableOrders, setTableOrders] = React.useState([{}]);
    const [visible2, setVisible2] = useState(false);
    const [todoOrders, setTodoOrders] = useState([{}])
    const [inprogressOrders, setInprogressOrders] = useState([{}])
    const [completedOrders, setCompletedOrders] = useState([{}])


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
            // if(response.data.orders['order_status'] == "To do"){
            //     console.log("abow");
            // }
            console.log("xxxx",response.data.orders.order_status)
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
        }, (error) => {
            console.log(error);
        });
    }

    useEffect(() => {
        getWaiterTables()
    }, []);

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
    const todoTitle = (
        <View>
            <Text style={{ ...FONTS.h4 }} >To do</Text>
        </View>
    )
    const todoBody = (
        <View>
            <Text style={styles.sectionTitle} >Profile</Text>
            <Text style={styles.sectionDescription} >Address, Contact</Text>
            <Text style={styles.sectionTitle} >Profile</Text>
            <Text style={styles.sectionDescription} >Address, Contact</Text>
        </View>
    )
    const inProgressTitle = (
        <View>
            <Text style={{ ...FONTS.h4 }} >In Progress</Text>
        </View>
    )
    const inProgressBody = (
        <View>
            <Text style={styles.sectionTitle} >Profile</Text>
            <Text style={styles.sectionDescription} >Address, Contact</Text>
            <Text style={styles.sectionTitle} >Profile</Text>
            <Text style={styles.sectionDescription} >Address, Contact</Text>
        </View>
    )
    const completedTitle = (
        <View>
            <Text style={{ ...FONTS.h4 }} >Completed</Text>
        </View>
    )
    let completedBody = (
        <View>
            <Text style={styles.sectionTitle} >Profile</Text>
            <Text style={styles.sectionDescription} >Address, Contact</Text>
            <Text style={styles.sectionTitle} >Profile</Text>
            <Text style={styles.sectionDescription} >Address, Contact</Text>
        </View>

    )
    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea}>
                <Header navigation={navigation}></Header>
                <View style={styles.container}>
                    <Text style={{ ...FONTS.h2 }}>Order Details of My Tables</Text>
                    <Accordion title={completedTitle} >
                        {/* {
                            tableOrders.map(({ order_status, prod_name, order_item_id }) => {
                                if (order_status == "Completed") {
                                    return (
                                        <View>
                                            <Text style={styles.sectionTitle} >Profile</Text>
                                            <Text style={styles.sectionDescription} >Address, Contact</Text>
                                            <Text style={styles.sectionTitle} >Profile</Text>
                                            <Text style={styles.sectionDescription} >Address, Contact</Text>
                                        </View>
                                    )
                                }
                            })
                        } */}

                    </Accordion>
                    <View style={{ alignItems: 'center' }} ><View style={styles.divider} /></View>
                    <Accordion title={inProgressTitle} >
                        {inProgressBody}
                    </Accordion>
                    <View style={{ alignItems: 'center' }} ><View style={styles.divider} /></View>
                    <Accordion title={todoTitle} >
                        {todoBody}
                    </Accordion>
                    <View style={{ alignItems: 'center' }} ><View style={styles.divider} /></View>

                </View>
            </SafeAreaView>
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
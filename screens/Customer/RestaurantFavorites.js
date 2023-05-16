import React from "react";
import { useState, useEffect } from "react";
import axios from 'axios';

import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList,
    RefreshControl,

} from "react-native";

import { icons, images, SIZES, COLORS, FONTS } from '../../constants'
import { Header } from '../../components';
import Route from "../../routes/Route";

const RestaurantFavorites = ({ navigation, route }) => {
    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);
    console.log(route.params.restaurantName);
    const [foods, setFoods] = useState([{}]);
    function getFoodStats() {
        axios({
            method: 'get',
            url: Route.host + '/restaurants/popular?restId=' + route.params.restaurantId
        }).then((response) => {
            console.log("poplar", response.data.data)
            setFoods(response.data.data);
        }, (error) => {
            console.log(error);
        });
    }

    useEffect(() => {
        getFoodStats();
    }, []);


    function renderRestaurantList() {
        const renderItem = ({ item }) => (
            <View>
                <View
                    style={{ marginBottom: SIZES.padding * 2 }}
                >
                    {/* Image */}
                    <View
                        style={{
                            marginBottom: SIZES.padding
                        }}
                    >
                        {item.prod_image ? (<Image
                            source={{ uri: item.prod_image['String'] }}
                            resizeMode="contain"
                            style={{
                                width: "100%",
                                height: 250,
                                borderRadius: SIZES.radius
                            }}
                        />) : (<Image
                            source={images.logo}
                            resizeMode="contain"
                            style={{
                                width: "100%",
                                height: 250,
                                borderRadius: SIZES.radius
                            }}
                        />)}
                    </View>
                </View>
                <TouchableOpacity
                    onPress={() => {
                        console.log(item.rest_id)
                        navigation.navigate("RestaurantFavorites", {
                            restaurantId: item.rest_id
                        })
                    }}
                >
                    {/* Restaurant Info */}
                    <Text style={{ ...FONTS.body2 }}>{item.prod_name}</Text>
                    <Text style={{ ...FONTS.body4, paddingBottom: 10, paddingTop: 10 }}>{item.prod_description}</Text>

                </TouchableOpacity>
            </View>
        )

        return (
            <FlatList
                data={foods}
                keyExtractor={item => `${item.prod_id}`}
                renderItem={renderItem}
                contentContainerStyle={{
                    paddingHorizontal: SIZES.padding * 2,
                    paddingBottom: 30,
                }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header navigation={navigation}></Header>
            <Text style={{ ...FONTS.h2, paddingBottom: 20, paddingTop: 20, textAlign: "center" }}>Popular Foods of {route.params.restaurantName}</Text>
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

export default RestaurantFavorites;
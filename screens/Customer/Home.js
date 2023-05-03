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
    FlatList
} from "react-native";

import { icons, images, SIZES, COLORS, FONTS } from '../../constants'
import { Header } from '../../components';
import Route from "../../routes/Route";

const Home = ({ navigation, route }) => {
    const [scanned, setScananed] = useState(false);
    const [restaurants, setRestaurants] = useState([]);
    useEffect(() => {
        axios({
            method: "get",
            url: Route.host + '/restaurants/top',
        }).then(function (response) {
            const rest = response.data.items;
            setRestaurants(rest);
        });
    }, []);


    function renderRestaurantList() {
        const renderItem = ({ item }) => (
            <TouchableOpacity
                style={{ marginBottom: SIZES.padding * 2 }}
                onPress={() => navigation.navigate("Menu", {
                    item, scanned
                })}
            >
                {/* Image */}
                <View
                    style={{
                        marginBottom: SIZES.padding
                    }}
                >
                    <Image
                        source={{ uri: item.logo }}
                        resizeMode="contain"
                        style={{
                            width: "100%",
                            height: 250,
                            borderRadius: SIZES.radius
                        }}
                    />
                </View>

                {/* Restaurant Info */}
                <Text style={{ ...FONTS.body2 }}>{item.name}</Text>
                <Text style={{ ...FONTS.body4 }}>{item.summary}</Text>
                <View
                    style={{
                        flexDirection: 'row',
                    }}>
                    <Image
                        source={icons.location}
                        style={{
                            height: 20,
                            width: 20,
                            tintColor: COLORS.primary,
                            marginRight: 10,
                            marginTop: 10
                        }}
                    />
                    <Text style={{
                        ...FONTS.body3,
                        marginTop: SIZES.padding,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {item.address}
                    </Text>
                    <Image
                        source={icons.info}
                        style={{
                            height: 20,
                            width: 20,
                            tintColor: COLORS.primary,
                            marginRight: 10,
                            marginTop: 10,
                            left: 280
                        }}
                        onPress={() => {
                            console.log(item.rest_id)
                            navigation.navigate("RestaurantFavorites", {
                                restaurantId: item.rest_id
                            })
                        }}
                    />
                </View>
            </TouchableOpacity>
        )

        return (
            <FlatList
                data={restaurants}
                keyExtractor={item => `${item.id}`}
                renderItem={renderItem}
                contentContainerStyle={{
                    paddingHorizontal: SIZES.padding * 2,
                    paddingBottom: 30,
                }}
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

export default Home
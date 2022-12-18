import React from "react";
import { useState } from "react";
import axios from'axios';
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

import { icons, images, SIZES, COLORS, FONTS } from '../constants'
import Header from '../components/Header';

const Home = ({ navigation, route }) => {


    // // Dummy Datas
    // axios.get('http://3.67.89.171:8080/restaurants') 
    // .then(function (response) {
    //     console.log(response);
    //     setRestaurants(JSON.stringify(response));
    // })
    // .catch(function (error) {
    //     console.log(error);
    // })
    // .then(function () {
    //     // always executed
    // });  


    const categoryData = [
        {
            id: 1,
            name: "Rice",
            icon: icons.rice_bowl,
        },
        {
            id: 2,
            name: "Noodles",
            icon: icons.noodle,
        },
        {
            id: 3,
            name: "Hot Dogs",
            icon: icons.hotdog,
        },
        {
            id: 4,
            name: "Salads",
            icon: icons.salad,
        },
        {
            id: 5,
            name: "Burgers",
            icon: icons.hamburger,
        },
        {
            id: 6,
            name: "Pizza",
            icon: icons.pizza,
        },
        {
            id: 7,
            name: "Snacks",
            icon: icons.fries,
        },
        {
            id: 8,
            name: "Sushi",
            icon: icons.sushi,
        },
        {
            id: 9,
            name: "Desserts",
            icon: icons.donut,
        },
        {
            id: 10,
            name: "Drinks",
            icon: icons.drink,
        },

    ]

    // price rating
    const affordable = 1
    const fairPrice = 2
    const expensive = 3

    const restList = [
        {
            "id": "62babe8c80329c81068ecbb4",
            "name": "Big Chefs",
            "description": "Her mevsim yeni bir başlangıç ve her yeni başlangıç yeni mutluluklar",
            "logo": images.avatar_1,
            "address": "Bilkent Plaza",
            "district": "Çankaya",
            "city": "Ankara",
            "country": "Türkiye",
            "phone": "0555 444 0 999",
            "tags": "#fast-food, #ev-yemekleri"
        },
        {
            "id": "62babe8c80329c81068ecbb45",
            "name": "Big Chefs",
            "description": "Her mevsim yeni bir başlangıç ve her yeni başlangıç yeni mutluluklar",
            "logo": images.tomato_pasta,
            "address": "Bilkent Plaza",
            "district": "Çankaya",
            "city": "Ankara",
            "country": "Türkiye",
            "phone": "0555 444 0 999",
            "tags": "#fast-food, #ev-yemekleri"
        },
        {
            "id": "62babe8c80329c81068ecbb456",
            "name": "Big Chefs",
            "description": "Her mevsim yeni bir başlangıç ve her yeni başlangıç yeni mutluluklar",
            "logo": images.tomato_pasta,
            "address": "Bilkent Plaza",
            "district": "Çankaya",
            "city": "Ankara",
            "country": "Türkiye",
            "phone": "0555 444 0 999",
            "tags": "#fast-food, #ev-yemekleri"
        }
    ]
    
    const [scanned, setScananed] = useState(false);
    const [restaurants, setRestaurants] = useState(restList);

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
                        source={item.photo}
                        resizeMode="cover"
                        style={{
                            width: "100%",
                            height: 200,
                            borderRadius: SIZES.radius
                        }}
                    />
                </View>

                {/* Restaurant Info */}
                <Text style={{ ...FONTS.body2 }}>{item.name}</Text>
                <Text style={{ ...FONTS.body4 }}>{item.description}</Text>
                <View>
                    <Image
                        source={icons.location}
                        style={{
                            height: 20,
                            width: 20,
                            tintColor: COLORS.primary,
                            marginRight: 10
                        }}
                    />
                    <Text style={{ 
                            ...FONTS.body3,
                            marginTop: SIZES.padding,
                            flexDirection: 'row',
                            alignItems:'center',
                            justifyContent:'center'
                        }}>
                        {item.address}
                    </Text>
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
                    paddingBottom: 30
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
        backgroundColor: COLORS.lightGray4
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
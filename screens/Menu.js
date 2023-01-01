import React from "react";
import { useEffect } from "react";
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

import { icons, images, SIZES, COLORS, FONTS } from '../constants'
import Header from '../components/Header';
import HeaderInside from "../components/HeaderInside";
import Tabs from '../navigation/tabs';

const Menu = ({ navigation, route }) => {

    const [categories, setCategories] = React.useState([]);
    const [selectedCategory, setSelectedCategory] = React.useState(null);
    const [products, setProducts] = React.useState();
    const [scanned, setScanned] = React.useState(route.params.scanned);
    const [restaurantName, setRestaurantName] = React.useState("");
    
    useEffect(() => {
        var restId = "";
        if (scanned) {
            restId = route.params.restaurantId;
        } else {
            restId = route.params.item.id;
        }
        const productsUrl = "http://utkuapi-env.eba-37pxsisp.eu-central-1.elasticbeanstalk.com/restaurants/" + restId  + "/products"
        const categoriesUrl = "http://utkuapi-env.eba-37pxsisp.eu-central-1.elasticbeanstalk.com/restaurants/" + restId  + "/categories";

        const productRequest = axios.get(productsUrl);
        const categoriesRequest = axios.get(categoriesUrl);

        axios.all([productRequest, categoriesRequest])
        .then(axios.spread((...responses) => {

            const responseOne = responses[0]
            const responseTwo = responses[1]            
            setCategories(responseTwo.data.items);
            setProducts(responseOne.data.items);
        }))

    }, []);


    function onSelectCategory(category) {
        //filter restaurantü
        var restId = "";

        if (scanned) {
          restId = route.params.restaurantId;
        } else {
          restId = route.params.item.id;
        }
        console.log(category.id);
        console.log(restId);
        axios({
          method: "get",
          url:
            "http://utkuapi-env.eba-37pxsisp.eu-central-1.elasticbeanstalk.com/restaurants/" + restId + "/categories/" +
            category.id +
            "/products",
        }).then(function (response) {
          console.log(response.data.items);
          setProducts(response.data.items);
        });
    }
    function renderMainCategories() {
        const renderItem = ({ item }) => {
            return (
                <TouchableOpacity
                    style={{
                        padding: SIZES.padding,
                        paddingBottom: SIZES.padding * 2,
                        backgroundColor: (selectedCategory?.id == item.id) ? COLORS.primary : COLORS.lightGray,
                        borderRadius: SIZES.radius,
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: SIZES.padding,
                        ...styles.shadow
                    }}
                    onPress={() => onSelectCategory(item)}
                >
                    <View
                        style={{
                            width: 50,
                            height: 30,
                            borderRadius: 25,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: (selectedCategory?.id == item.id) ? COLORS.white : COLORS.lightGray
                        }}
                    >
                        <Image
                            source={{uri:item.image}}
                            resizeMode="contain"
                            style={{
                                width: 30,
                                height: 30
                            }}
                        />
                    </View>

                    <Text
                        style={{
                            marginTop: SIZES.padding,
                            color: (selectedCategory?.id == item.id) ? COLORS.white : COLORS.black,
                            ...FONTS.body5
                        }}
                    >
                        {item.name}
                    </Text>
                </TouchableOpacity>
            )
        }

        return (
            <View style={{ padding: SIZES.padding * 2 }}>
                <Text style={{ ...FONTS.h2, textAlign:"center" }}>{scanned ? route.params.restaurantName : route.params.item.name}</Text>
                <FlatList
                    data={categories}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={item => `${item.id}`}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingVertical: SIZES.padding * 2 }}
                />
            </View>
        )
    }

    function renderRestaurantList() {
        const renderItem = ({ item }) => (
            <TouchableOpacity
                style={{ 
                    marginBottom: SIZES.padding * 2 ,
                    width:"45%",
                    margin:10
                }}
                onPress={() => navigation.navigate("FoodItem", {
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
                        source={{uri:item.image}}
                        resizeMode="cover"
                        style={{
                            width: "100%",
                            height: 200,
                            borderRadius: SIZES.radius
                        }}
                    />

                    <View
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            height: 40,
                            width: SIZES.width * 0.15,
                            backgroundColor: COLORS.lightGray2,
                            borderTopRightRadius: SIZES.radius,
                            borderBottomLeftRadius: SIZES.radius,
                            alignItems: 'center',
                            justifyContent: 'center',
                            ...styles.shadow
                        }}
                    >
                        <Text style={{ ...FONTS.body4 }}>{item.price} {item.currency}</Text>
                    </View>
                </View>

                {/* Food Info */}
                <Text style={{ ...FONTS.body2 }}>{item.name}</Text>
            </TouchableOpacity>
        )

        return (
            <FlatList
                data={products}
                keyExtractor={item => `${item.id}`}
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
            <HeaderInside navigation={navigation}></HeaderInside>
            {renderMainCategories()}
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

export default Menu
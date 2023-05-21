import React from "react";
import { useEffect, useState } from "react";
import axios from 'axios';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList,
    TextInput,
    RefreshControl,
    BackHandler

} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { icons, images, SIZES, COLORS, FONTS } from '../../constants'
import { HeaderInside } from '../../components';
import Route from "../../routes/Route";


const Menu = ({ navigation, route }) => {
    const [categories, setCategories] = useState([{}]);
    const [selectedCategory, setSelectedCategory] = React.useState(null);
    const [products, setProducts] = React.useState([{}]);
    const [scanned, setScanned] = React.useState(false);
    const [restaurantName, setRestaurantName] = React.useState("");
    const [refreshing, setRefreshing] = React.useState(false);
    const [cartCount, setCartCount] = useState(0);
    const isFocused = useIsFocused();



    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchCartCount();
          
        });
    
        return unsubscribe;
      }, [navigation]);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
            var restId = "";
            var tableId = "";

            if (route.params.scanned) {
                setScanned(true)
                restId = route.params.restaurantId
                tableId = route.params.tableId
                AsyncStorage.setItem("tableId", tableId);
            } else {
                restId = route.params.item.rest_id.toString()
            }
            AsyncStorage.setItem("restaurantId", restId);
            getCategories(restId);
            getMenuItems(restId);
            getRestauranName(restId)
            fetchCartCount();
        }, 200);
    }, []);

    useEffect(() => {
        var restId = "";
        var tableId = "";

        if (route.params.scanned) {
            setScanned(true)
            restId = route.params.restaurantId
            tableId = route.params.tableId
            AsyncStorage.setItem("tableId", tableId);
        } else {
            restId = route.params.item.rest_id.toString()
        }
        AsyncStorage.setItem("restaurantId", restId);
        getCategories(restId);
        getMenuItems(restId);
        getRestauranName(restId)
        fetchCartCount();
    }, []);

    function getRestauranName(restId) {
        axios({
            method: "get",
            url: Route.host + "/restaurants/?resId=" + restId,
        }).then(
            function (response) {
                setRestaurantName(response.data.items[0].rest_name)
            },
            (error) => {
                console.log(error);
            }
        );
    }
    function getCategories(rest_id) {
        axios({
            method: "get",
            url: Route.host + "/restaurants/categories?resId=" + rest_id,
        })
            .then(function (response) {
                const newCategory = {
                    cat_desc: "",
                    cat_id: 0, // Assign a unique ID to the new category
                    cat_image: {
                        String: "https://cdn-icons-png.flaticon.com/512/5562/5562062.png",
                        Valid: false,
                    },
                    cat_name: "All", // Change the name to the desired category name
                    parent_cat_id: 1,
                    rest_id: 0,
                };

                const updatedCategories = [newCategory, ...response.data.items];
                setCategories(updatedCategories);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function getMenuItems(rest_id) {
        axios({
            method: "get",
            url:
                Route.host + "/restaurants/products?resId=" + rest_id
        }).then(function (response) {
            setProducts(response.data.items);
        });
    }

    function onSelectCategory(category) {
        var restId = "";
        var tableId = "";

        if (route.params.scanned) {
            setScanned(true)
            restId = route.params.restaurantId
            tableId = route.params.tableId
            AsyncStorage.setItem("tableId", tableId);
        } else {
            restId = route.params.item.rest_id
        }

        if (category.cat_id == 0) {
            axios({
                method: "get",
                url: Route.host + '/restaurants/products?resId=' + restId,
            }).then(function (response) {
                setProducts(response.data.items);
            }),
                (error) => {
                    console.log(error);
                };
        } else {
            axios({
                method: "get",
                url: Route.host + '/restaurants/categories/products?resId=' + restId + '&catId=' + category.cat_id,
            }).then(function (response) {
                setProducts(response.data.items);
            }, (error) => {
                setProducts([{}]);
            })
        }

    }
    const fetchCartCount = async () => {
        try {
            const items = await AsyncStorage.getItem("item");
            if (items) {
                const cartItems = JSON.parse(items);
                let count = 0;
                for (let i = 0; i < cartItems.length; i++) {
                    count += cartItems[i].count;
                }
                setCartCount(count);
            }
        } catch (error) {
            console.log("Error fetching cart count:", error);
        }
    };


    useEffect(() => {
        const updateCartCount = async () => {
            try {
                const items = await AsyncStorage.getItem("item");
                if (items) {
                    const cartItems = JSON.parse(items);
                    let count = 0;
                    for (let i = 0; i < cartItems.length; i++) {
                        count += cartItems[i].count;
                    }
                    setCartCount(count);
                }
            } catch (error) {
                console.log("Error updating cart count:", error);
            }
        };

        updateCartCount();
    }, [navigation]);

    function renderMainCategories() {
        const renderItem = ({ item }) => {
            return (
                <TouchableOpacity
                    style={{
                        padding: SIZES.padding,
                        paddingBottom: SIZES.padding * 2,
                        backgroundColor: (selectedCategory?.id == item.cat_id) ? COLORS.primary : COLORS.lightGray,
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
                            backgroundColor: (selectedCategory?.id == item.cat_id) ? COLORS.white : COLORS.lightGray
                        }}
                    >
                        {item.cat_image ? (<Image
                            source={{ uri: item.cat_image['String'] }}
                            resizeMode="cover"
                            style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: SIZES.radius
                            }}
                        />) : (<Image
                            source={images.logo}
                            resizeMode="cover"
                            style={{
                                width: "100%",
                                height: 200,
                                borderRadius: SIZES.radius
                            }}
                        />)}
                    </View>

                    <Text
                        style={{
                            marginTop: SIZES.padding,
                            color: (selectedCategory?.id == item.cat_id) ? COLORS.white : COLORS.black,
                            ...FONTS.body5
                        }}
                    >
                        {item.cat_name}
                    </Text>
                </TouchableOpacity>
            )
        }

        return (
            <View style={{ padding: SIZES.padding * 2 }}>
                <Text style={{ ...FONTS.h2, textAlign: "center" }}>{scanned ? restaurantName : route.params.restaurantName}</Text>
                <FlatList
                    data={categories}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={item => `${item.cat_id}`}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingVertical: SIZES.padding * 2 }}
                />
            </View>
        )
    }

    function renderRestaurantList() {
        if (products.length === 0 || (products.length === 1 && Object.keys(products[0]).length === 0)) {
            return (
                <View style={styles.container}>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Image
                            source={images.empty}
                            resizeMode="cover"
                            style={{
                                width: "75%",
                                height: "75%",
                                borderRadius: SIZES.radius
                            }}
                        />
                        <Text style={{ ...FONTS.h3, marginTop: 10, textAlign: 'center' }}>No products in this category</Text>
                    </View>
                </View>


            );
        }
        const renderItem = ({ item }) =>
        (
            <TouchableOpacity
                style={{
                    marginBottom: SIZES.padding * 2,
                    width: "45%",
                    margin: 10
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
                    {item.prod_image ? (<Image
                        source={{ uri: item.prod_image['String'] }}
                        resizeMode="cover"
                        style={{
                            width: "100%",
                            height: 200,
                            borderRadius: SIZES.radius
                        }}
                    />) : (<Image
                        source={images.logo}
                        resizeMode="cover"
                        style={{
                            width: "100%",
                            height: 200,
                            borderRadius: SIZES.radius
                        }}
                    />)}
                    {/* Out of Stock */}
                    {!item.availability && (
                        <View style={styles.outOfStockContainer}>
                            <Text style={styles.outOfStockText}>Out of Stock</Text>
                        </View>
                    )}

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
                <Text style={{ ...FONTS.body2 }}>{item.prod_name}</Text>
            </TouchableOpacity>
        )
        return (
            <FlatList
                data={products}
                keyExtractor={item => `${item.prod_id}`}
                renderItem={renderItem}
                contentContainerStyle={{
                    paddingHorizontal: SIZES.padding * 2,
                    paddingBottom: 30,
                }}
                numColumns={2}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
        )

    }

    return (
        <SafeAreaView style={styles.container}>
            <HeaderInside navigation={navigation} cartCount={cartCount}></HeaderInside>
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
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.gray,
        marginVertical: 20,
    },
    outOfStockContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: SIZES.radius
    },
    outOfStockText: {
        color: COLORS.white,
        ...FONTS.body2
    }
})

export default Menu
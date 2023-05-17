
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from '@react-navigation/native'
import { useFonts } from 'expo-font';
import React, { useEffect, useState } from "react";
import { FoodItem, Menu, Cart, Home, RestaurantFavorites, OrderStatus, OrderStatus2, Login, Register, ForgotPassword, Tables, Tables2, MyCard, AddCard, Pay, PaymentSuccess, Loading, OnBoarding } from './screens'
import Tabs from './navigation/tabs'
import Profile from "./screens/Profile/Profile";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createStackNavigator();


const App = () => {
    const [loaded] = useFonts({
        "Roboto-Black": require('./assets/fonts/Roboto-Black.ttf'),
        "Roboto-Bold": require('./assets/fonts/Roboto-Bold.ttf'),
        "Roboto-Regular": require('./assets/fonts/Roboto-Regular.ttf'),
    })
    
    const [accessToken, setAccessToken] = useState(null);
    useEffect(() => {
      
        async function getToken() {
            const t = await AsyncStorage.getItem("accessToken");
            setAccessToken(t);
        }
        getToken();
    }, []);
    if (!loaded) {
        return null;
        
    }
    if (accessToken == undefined) {
        console.log(accessToken)
        return (
            <NavigationContainer>
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false
                    }}

                    initialRouteName={'OnBoarding'}
                >
                    <Stack.Screen name="OnBoarding" component={OnBoarding} />

                    <Stack.Screen name="Login" component={Login} />
                    <Stack.Screen name="Register" component={Register} />

                    <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
                    <Stack.Screen name="Home" component={Tabs} />
                    <Stack.Screen name="RestaurantFavorites" component={RestaurantFavorites} />

                    <Stack.Screen name="Tables" component={Tables} />
                    <Stack.Screen name="Tables2" component={Tables2} />

                    <Stack.Screen name="Menu" component={Menu} />

                    <Stack.Screen name="Cart" component={Cart} />
                    <Stack.Screen name="Pay" component={Pay} />
                    <Stack.Screen name="PaymentSuccess" component={PaymentSuccess} />
                    <Stack.Screen name="Loading" component={Loading} />

                    <Stack.Screen name="MyCard" component={MyCard} />
                    <Stack.Screen name="AddCard" component={AddCard} />
                    <Stack.Screen name="FoodItem" component={FoodItem} />
                    <Stack.Screen name="OrderStatus" component={OrderStatus} />
                    <Stack.Screen name="OrderStatus2" component={OrderStatus2} />

                    <Stack.Screen name="Profile" component={Profile} />
                </Stack.Navigator>
            </NavigationContainer>
        )
    } else {

        return (
            <NavigationContainer>
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false
                    }}
    
                    initialRouteName={'Home'}
                >
                    <Stack.Screen name="Home" component={Tabs} />

                    <Stack.Screen name="OnBoarding" component={OnBoarding} />
    
                    <Stack.Screen name="Login" component={Login} />
                    <Stack.Screen name="Register" component={Register} />
    
                    <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
                    <Stack.Screen name="RestaurantFavorites" component={RestaurantFavorites} />
    
                    <Stack.Screen name="Tables" component={Tables} />
                    <Stack.Screen name="Tables2" component={Tables2} />
    
                    <Stack.Screen name="Menu" component={Menu} />
    
                    <Stack.Screen name="Cart" component={Cart} />
                    <Stack.Screen name="Pay" component={Pay} />
                    <Stack.Screen name="PaymentSuccess" component={PaymentSuccess} />
                    <Stack.Screen name="Loading" component={Loading} />
    
                    <Stack.Screen name="MyCard" component={MyCard} />
                    <Stack.Screen name="AddCard" component={AddCard} />
                    <Stack.Screen name="FoodItem" component={FoodItem} />
                    <Stack.Screen name="OrderStatus" component={OrderStatus} />
                    <Stack.Screen name="OrderStatus2" component={OrderStatus2} />
    
                    <Stack.Screen name="Profile" component={Profile} />
                </Stack.Navigator>
    
            </NavigationContainer>
        )
    }
    
}

export default App;
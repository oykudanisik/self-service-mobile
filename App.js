
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from '@react-navigation/native'
import { useFonts } from 'expo-font';

import { FoodItem, Menu, Cart, Home, OrderAccepted, Login, Register, ForgotPassword } from './screens'
import Tabs from './navigation/tabs'
import Profile from "./screens/Profile";

const Stack = createStackNavigator();

const App = () => {

    const [loaded] = useFonts({
        "Roboto-Black": require('./assets/fonts/Roboto-Black.ttf'),
        "Roboto-Bold": require('./assets/fonts/Roboto-Bold.ttf'),
        "Roboto-Regular": require('./assets/fonts/Roboto-Regular.ttf'),

    })

    if (!loaded) {
        return null;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}
                initialRouteName={'Login'}
            >
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
                <Stack.Screen name="Home" component={Tabs} />
                <Stack.Screen name="FoodItem" component={FoodItem} />
                <Stack.Screen name="Menu" component={Menu} />
                <Stack.Screen name="Cart" component={Cart} />
                <Stack.Screen name="OrderAccepted" component={OrderAccepted} />
                <Stack.Screen name="Profile" component={Profile} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default App;

import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from '@react-navigation/native'
import { useFonts } from 'expo-font';

import { FoodItem, OnBoarding, Menu } from './screens'
import Tabs from './navigation/tabs'
import Header from "./components/Header";
const Stack = createStackNavigator();

const App = () => {

    const [loaded] = useFonts({
      "Roboto-Black" : require('./assets/fonts/Roboto-Black.ttf'),
      "Roboto-Bold" : require('./assets/fonts/Roboto-Bold.ttf'),
      "Roboto-Regular" : require('./assets/fonts/Roboto-Regular.ttf'),

    })
    
    if(!loaded){
      return null;
    }
  
      return (
          <NavigationContainer>
              <Stack.Navigator
                  screenOptions={{
                      headerShown: false
                  }}
                  initialRouteName={'OnBoarding'}
              >
                  <Stack.Screen name="OnBoarding" component={OnBoarding} />
                  <Stack.Screen name="Home" component={Tabs} />
                  <Stack.Screen name="FoodItem" component={FoodItem}/>
                  <Stack.Screen name="Menu" component={Menu}/>
                  <Stack.Screen name="Header" component={Header}/>


              </Stack.Navigator>
          </NavigationContainer>
      )
    
}

export default App;
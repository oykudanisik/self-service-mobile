import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { COLORS } from '../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SwipeListView } from 'react-native-swipe-list-view';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
export default function Scan({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState('Not yet scanned');
  const [restaurantId, setRestaurantId] = useState();
  const [restaurantName, setRestaurantName] = useState();
  const [tableId, setTableId] = useState();
  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })()
  }

  // Request Camera Permission
  useEffect(() => {
    askForCameraPermission();
  }, []);
  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80
  };

  const onSwipeRight = () => {
    navigation.navigate('Home');
  };
  useEffect(() => {
    AsyncStorage.setItem("tableId", tableId);
    AsyncStorage.setItem("restaurantId", restaurantId);

    if (scanned) {
      console.log("hehehe", restaurantId);
      console.log("xxx", tableId);
      navigation.navigate("Menu", {
        restaurantId,
        tableId,
        scanned,
      });
    }
  }, [restaurantId]);

  // What happens when we scan the bar code
  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    setText(data)
    console.log("asjkdhkajs", JSON.parse(data));
    setRestaurantId(JSON.parse(data).rest_id.toString());
    setTableId(JSON.parse(data).table_no.toString());
  };

  // Check permissions and return the screens
  if (hasPermission === null) {
    return (
      <GestureRecognizer
        onSwipeRight={onSwipeRight}
        config={config}
        style={styles.container}
      >
        <View style={styles.container}>
          <Text>Requesting for camera permission</Text>
        </View>
      </GestureRecognizer>
    )
  }
  if (hasPermission === false) {
    return (
      <GestureRecognizer
        onSwipeRight={onSwipeRight}
        config={config}
        style={styles.container}
      >
        <View style={styles.container}>
          <Text style={{ margin: 10 }}>No access to camera</Text>
          <Button title={'Allow Camera'} onPress={() => askForCameraPermission()} />
        </View>
      </GestureRecognizer>
    )

  }

  // Return the View
  return (
    <GestureRecognizer
      onSwipeRight={onSwipeRight}
      config={config}
      style={styles.container}
    >
      <View style={styles.container}>
        <Text style={styles.maintext}>Please scan the QR code</Text>
        <View style={styles.barcodebox}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={{ height: 400, width: 400 }}
          />
        </View>
        {scanned && (
          <Button
            title={"Scan again?"}
            onPress={() => {
              setScanned(false);
              setRestaurantId(null);
              setTableId(null);
            }}
            color={COLORS.primary}
          />
        )}
      </View>
    </GestureRecognizer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  maintext: {
    fontSize: 30,
    margin: 20,
    color: COLORS.primary
  },
  barcodebox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    width: 300,
    overflow: 'hidden',
    borderRadius: 30,
    backgroundColor: 'tomato'
  }
});
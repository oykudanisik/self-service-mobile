import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { COLORS } from '../constants';

export default function Scan({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState('Not yet scanned');
  const [restaurantId, setRestaurantId] = useState(null);
  const [restaurantName, setRestaurantName] = useState(null);

  const [tableId, setTableId] = useState(null);


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

  useEffect(() => {
    if (scanned) {
      navigation.navigate("Menu", {
        restaurantId,
        restaurantName,
        tableId,
        scanned,
      });
    }
  }, [restaurantId]);

  // What happens when we scan the bar code
  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    setText(data)
    setRestaurantId(JSON.parse(data).restaurantId);
    setRestaurantName(JSON.parse(data).restaurantName)
    setTableId(JSON.parse(data).tableId);
  };

  // Check permissions and return the screens
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting for camera permission</Text>
      </View>)
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={{ margin: 10 }}>No access to camera</Text>
        <Button title={'Allow Camera'} onPress={() => askForCameraPermission()} />
      </View>)
  }

  // Return the View
  return (
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
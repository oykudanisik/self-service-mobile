import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const Loading = ({ navigation }) => {
    useEffect(() => {
        const interval = setInterval(() => {
            navigation.navigate("PaymentSuccess")
        }, 1000);
        return () => clearInterval(interval);
    }, [])
    return (
        <View style={[styles.container, styles.horizontal]}>
            <ActivityIndicator size="large" color="#6C63FF" />
        </View>)
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
});

export default Loading;
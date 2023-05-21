import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { COLORS } from '../constants'

const SecondaryButton = ({ title, onPress = () => { } }) => {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <View style={{ ...style.btnContainer, backgroundColor: COLORS.lightGray2 }}>
        <Text style={{ ...style.title, color: COLORS.primary }}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
  title: { color: COLORS.white, fontWeight: 'bold', fontSize: 17 },
  btnContainer: {
    backgroundColor: COLORS.lightGray2,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SecondaryButton ;
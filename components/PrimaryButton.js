import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { COLORS } from '../constants'

const PrimaryButton = ({ title, onPress = () => { }, disabled, buttonStyle }) => {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} disabled={disabled}>
      <View style={[style.btnContainer, buttonStyle, disabled && style.disabledBtn]}>
        <Text style={style.title}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
  title: { color: COLORS.white, fontWeight: 'bold', fontSize: 18 },
  btnContainer: {
    backgroundColor: COLORS.primary,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledBtn: {
    backgroundColor: COLORS.lightGray,
  },
});

export default PrimaryButton;

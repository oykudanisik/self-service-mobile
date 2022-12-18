import React from "react";
import { View, Button, TouchableOpacity, Image } from "react-native";

import { icons, images, SIZES, COLORS, FONTS } from "../constants";

const HeaderInside = ({ navigation }) => {
  return (
    <View style={{ flexDirection: "row", height: "13%", marginBottom: 10 }}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          width: 50,
          paddingLeft: SIZES.padding * 2,
          justifyContent: "center",
        }}
      >
        <Image
          source={icons.back}
          resizeMode="contain"
          style={{
            width: 25,
            height: 25,
          }}
        />
      </TouchableOpacity>

      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Image
          style={{
            marginTop: 25,
            width: 180,
            height: 90,
            paddingRight: SIZES.padding * 2,
            justifyContent: "center",
          }}
          source={images.logoInside}
        ></Image>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate("Home")}
        style={{
          width: 50,
          paddingRight: SIZES.padding * 2,
          justifyContent: "center",
        }}
      >
        <Image
          source={icons.home}
          resizeMode="contain"
          style={{
            width: 25,
            height: 25,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};
export default HeaderInside;
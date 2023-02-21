import React from "react";
import {
  View,
  TouchableOpacity,
  ImageBackground,
  Text,
  Icon,
  TextInput,
  StyleSheet,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons, COLORS, SIZES, FONTS, images } from "../../constants";
import { Header } from "../../components";

const Profile = ({ navigation }) => {
  return (
    <SafeAreaView>
      <Header navigation={navigation}></Header>
      <View style={styles.container}>
        <Image style={styles.header} source={images.bground} />
        <Image style={styles.avatar} source={images.pp} />

        <View style={styles.body}>
          <Text style={styles.name}>Team 2</Text>
          <TouchableOpacity style={styles.buttonContainer}>
            <Text style={{ color: COLORS.white }}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 320,
              borderTopWidth: 1,
              paddingTop: 12,
              paddingBottom: 12,
              marginTop: 32,
            }}
          >
            <View
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
              }}
            >
              <Text>Privacy Settings</Text>
              <Image style={{ width: 24, height: 24 }} source={icons.user} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 320,
              paddingBottom: 12,
              paddingTop: 12,
              borderTopWidth: 1,
            }}
          >
            <View
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
              }}
            >
              <Text>Notifications</Text>
              <Image
                style={{ width: 24, height: 24 }}
                source={icons.notification}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 320,
              paddingBottom: 12,
              paddingTop: 12,
              borderTopWidth: 1,
            }}
          >
            <View
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
              }}
            >
              <Text>Payment History</Text>
              <Image style={{ width: 24, height: 24 }} source={icons.payment} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: 20,
    width: "100%",
    height: 100,
    backgroundColor: COLORS.primary,
    height: 200,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom: 10,
    alignSelf: "center",
    position: "absolute",
    marginTop: 160,
  },
  name: {
    fontSize: 22,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  body: {
    marginTop: 80,
    alignItems: "center",
  },
  bodyContent: {
    flex: 1,
    alignItems: "center",
    padding: 30,
  },
  name: {
    fontSize: 28,
    color: COLORS.black,
    fontWeight: "600",
  },
  info: {
    fontSize: 16,
    color: "#00BFFF",
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    color: "#696969",
    marginTop: 10,
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 10,
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: 150,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
  },
});

export default Profile;

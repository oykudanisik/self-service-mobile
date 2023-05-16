import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  ImageBackground,
  Text,
  Icon,
  TextInput,
  StyleSheet,
  Image,
  RefreshControl,

} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Route from '../../routes/Route';
import { Dialog } from '@rneui/themed';
import { icons, COLORS, SIZES, FONTS, images } from "../../constants";
import { Header } from "../../components";
import { SwipeListView } from "react-native-swipe-list-view";

const Profile = ({ navigation }) => {

  const [userDetails, setUserDetails] = useState({});
  const [userProfilePicture, setUserProfilePicture] = useState("");
  const [visible2, setVisible2] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  let ppicture = "";
  const toggleDialog2 = () => {
    setVisible2(!visible2);
  };
  async function getUserDetails() {
    let token = await AsyncStorage.getItem("accessToken");
    console.log(token);
    token = JSON.parse(token);
    console.log(token.uid)
    axios({
      method: "get",
      url: Route.host + '/users?userId=' + token.uid

    }).then(function (response) {
      console.log(response.data.items[0].type);
      setUserDetails(response.data.items[0]);
      ppicture = response.data.items[0].type + "pp";
    });
  }

  useEffect(() => {
    getUserDetails();
  }, [])

  async function removeToken() {
    await AsyncStorage.removeItem("accessToken");
    await navigation.navigate("Login")
  }
  return (
    <SafeAreaView>
        <Header navigation={navigation}></Header>
        <View style={styles.container}>
          <Image style={styles.header} source={images.logo} />
          <Image style={styles.avatar} source={images.ppicture} />

          <View style={styles.body}>
            <Text style={styles.name}>{userDetails.user_name}</Text>
            <TouchableOpacity
              onPress={() => {
                removeToken();
              }}
              style={styles.buttonContainer}>
              <Text style={{ color: COLORS.white }}>Logout</Text>
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

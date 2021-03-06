import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Constants from "expo-constants";
import { useFonts } from "@use-expo/font";
import AuthNavigation from "./components/navigation/AuthNavigation";

export default function App() {
  let [fontsLoaded] = useFonts({
    SourceSansPro: require("./assets/fonts/SourceSansPro-Regular.ttf"),
    "SourceSansPro-SemiBold": require("./assets/fonts/SourceSansPro-SemiBold.ttf"),
    Pattaya: require("./assets/fonts/Pattaya-Regular.ttf"),
  });

  return (
    fontsLoaded && (
      <View style={styles.container}>
        <AuthNavigation />
      </View>
    )
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: Constants.statusBarHeight,
  },
});

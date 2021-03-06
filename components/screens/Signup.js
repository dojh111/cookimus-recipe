import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { firestoreDb, auth } from "../../config/Firebase/firebaseConfig";
import Button from "../generic/Button";

export default function Signup({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onLoginLinkPress = () => {
    navigation.navigate("Login");
  };

  const onSignupPress = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      const response = await auth.createUserWithEmailAndPassword(
        email,
        password
      );
      const uid = response.user.uid;
      const data = {
        id: uid,
        email: email,
        firstName: firstName,
        lastName: lastName,
      };
      const usersRef = firestoreDb.collection("users");
      await usersRef.doc(uid).set(data);
    } catch (err) {
      alert(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: "100%" }}
        keyboardShouldPersistTaps="always"
      >
        <Image
          style={styles.logo}
          source={require("../../assets/images/Logo.png")}
        />
        <View style={styles.name}>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            placeholderTextColor="#aaaaaa"
            onChangeText={(text) => setFirstName(text)}
            value={firstName}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            placeholderTextColor="#aaaaaa"
            onChangeText={(text) => setLastName(text)}
            value={lastName}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setEmail(text)}
          value={email}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#aaaaaa"
          secureTextEntry
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
          value={password}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#aaaaaa"
          secureTextEntry
          placeholder="Confirm Password"
          onChangeText={(text) => setConfirmPassword(text)}
          value={confirmPassword}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <Button
          text={"Create account"}
          onPress={onSignupPress}
          loading={loading}
          style={styles.button}
          textStyle={styles.loginText}
        />
        <View style={styles.footerView}>
          <Text style={[styles.footerText, styles.text]}>
            Already got an account?{" "}
            <Text onPress={onLoginLinkPress} style={styles.footerLink}>
              Log in
            </Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 30,
  },
  title: {},
  logo: {
    flex: 1,
    margin: 30,
    width: 100,
    alignSelf: "center",
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#CCCCCC",
    overflow: "hidden",
    marginVertical: 18,
    fontFamily: "SourceSansPro",
    fontSize: 18,

  },
  button: {
    backgroundColor: "dodgerblue",
    marginTop: 20,
    paddingHorizontal: 25,
    paddingVertical: 8,
  },
  footerView: {
    flex: 1,
    alignItems: "center",
    marginTop: 20,
  },
  text: {
    fontFamily: "SourceSansPro",
  },
  loginText: {
    fontSize: 18,
  },
  footerText: {
    fontSize: 16,
    color: "#2e2e2d",
  },
  footerLink: {
    color: "dodgerblue",
    fontWeight: "bold",
    fontSize: 16,
  },
});

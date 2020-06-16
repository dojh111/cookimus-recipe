import React from "react";
import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import IngredientBox from "../screen-components/recipe/IngredientBox.js";

//This file will render the individual recipe pages when clicked into from the search page
const Recipe = () => {
  const route = useRoute();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <Image
          style={[styles.image, { height: route.params.Window.height / 3 }]}
          source={{ uri: `${route.params.image}` }}
        />
        <View style={styles.categoryBox}>
          <Text style={[styles.text, styles.name]}>{route.params.name}</Text>
        </View>
        <IngredientBox ingredients={route.params.ingredients} />
      </ScrollView>
    </View>
  );
};

export default Recipe;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
  },
  image: {
    borderRadius: 5,
    //marginTop: 10,
    width: null,
  },
  text: {
    fontFamily: "SourceSansPro-SemiBold",
  },
  name: {
    fontSize: 30,
    marginVertical: 15,
    textAlign: "center",
    fontWeight: "bold",
  },
  categoryBox: {
    borderBottomWidth: 5,
    borderBottomColor: "#778899"
  }
});

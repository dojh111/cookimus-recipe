import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Entypo, Feather } from "@expo/vector-icons";
import LoadingIndicator from "../generic/LoadingIndicator";

import IngredientBox from "../screen-components/recipe/IngredientBox.js";
import AdditionalInfo from "../screen-components/recipe/AdditionalInfo.js";
import PrepMethod from "../screen-components/recipe/PrepMethod.js";
import SavedRecipe from "../../data/SavedRecipes.js";

import LoadingAdditionalContext from "../context/LoadingAdditionalContext.js";

//Check whether recipe has already been added
const checkRecipe = (link) => {
  for (let item of SavedRecipe) {
    if (item.url === link) {
      //Recipe has already been added
      return true;
    }
  }
  return false;
}

//Render the individual recipe pages when clicked into from the search page
const Recipe = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const [addedToList, setAddedToList] = useState(false);

  //Props from SearchList.js, passed through SearchCard.js
  const Window = route.params.Window;
  const name = route.params.name;
  const url = route.params.url;
  const image = route.params.image;
  const index = route.params.index;

  return (
    //Additional data for the recipe comes from the context
    <LoadingAdditionalContext.Consumer>
      {({ loadingAdditional, additionalData }) => (
        <View style={styles.container}>
          {loadingAdditional ? (
            <LoadingIndicator size={"large"} />
          ) : (
              <View>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <Image
                    style={[styles.image, { height: Window.height / 3 }]}
                    source={{ uri: `${image}` }}
                  />
                  {/* Extra info e.g. servings, preparation time*/}
                  <View style={styles.categoryBox}>
                    <View style={styles.subBox}>
                      <Text style={[styles.text, styles.name]}>{name}</Text>
                    </View>
                    <AdditionalInfo
                      additional={additionalData[index].additionalInfo}
                    />
                  </View>

                  <IngredientBox
                    ingredients={additionalData[index].originalIngredient}
                  />

                  {/*Add to grocery list*/}
                  <TouchableOpacity
                    onPress={() => {
                      if (!checkRecipe(url)) {
                        setAddedToList(true);
                        navigation.navigate("ConfirmIngredients", {
                          originalIngredients:
                            additionalData[index].originalIngredient,
                          modIngredients: additionalData[index].ingredient,
                          recipeURL: url,
                          recipeTitle: name,
                        });
                      }
                    }}
                    style={styles.buttonBox}
                  >
                    <Text style={styles.addButton}>Add to Grocery List </Text>
                    <Entypo name="add-to-list" size={19} color="#1E90FF" />
                  </TouchableOpacity>
                  {addedToList ? (
                    <Text style={styles.addedText}>Added to Grocery list!</Text>
                  ) : null}
                  <PrepMethod
                    instructions={additionalData[index].prepInstructions}
                  />
                  <View style={{ height: 50 }}></View>
                  {/*Store recipe locally*/}
                  {/* <TouchableOpacity
                onPress={() => {
                  SaveRecipe(
                    name,
                    url,
                    image,
                    additionalData[index].originalIngredient,
                    additionalData[index].ingredient,
                    additionalData[index].additionalInfo,
                    additionalData[index].prepInstructions
                  );
                }}
                style={styles.buttonBox}
              >
                <Text style={styles.addButton}>Save This Recipe </Text>
                <Feather name="save" size={19} color="#1E90FF" />
              </TouchableOpacity> */}
                </ScrollView>
              </View>
            )}
        </View>
      )}
    </LoadingAdditionalContext.Consumer>
  );
};

export default Recipe;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#f9f9f9"
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    borderRadius: 5,
    width: null,
  },
  text: {
    fontFamily: "SourceSansPro-SemiBold",
  },
  name: {
    fontSize: 33,
    marginVertical: 15,
    textAlign: "center",
    fontWeight: "bold",
  },
  categoryBox: {
    borderBottomWidth: 3,
    borderBottomColor: "#FFA07A",
  },
  subBox: {
    borderBottomWidth: 3,
    marginBottom: 10,
    borderBottomColor: "#F08080",
  },
  addButton: {
    fontSize: 17,
    color: "#1E90FF",
  },
  addedText: {
    color: "green",
    textAlign: "center",
    fontSize: 17,
  },
  buttonBox: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    margin: 8,
  },
});

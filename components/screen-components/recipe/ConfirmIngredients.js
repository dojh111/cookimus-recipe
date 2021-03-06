import React, { Component } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Dimensions
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  Entypo,
  MaterialIcons,
} from "@expo/vector-icons";
import {
  KeyboardAwareScrollView,
  KeyboardAwareFlatList,
} from "react-native-keyboard-aware-scroll-view";
import Button from "../../generic/Button";

import UnitSelectModal from "../grocery-list/UnitSelectModal.js";
import HashFunctions from "../grocery-list/HashFunctions.js";
import AddRecipe from "./AddRecipe.js";

let DATA = [];
let screen = Dimensions.get("window")

//Render card for ingredients
const RenderItemCard = ({
  item,
  index,
  handlenameupdate,
  handlequantityupdate,
  selectUnitModal,
  calldetermineclass,
  handledelete,
}) => {
  if (index % 2 === 0) {
    //Print out original recipe
    if (item.ingredient === "") {
      return <View></View>;
    } else {
      return (
        <View style={styles.originalCard}>
          <Text style={[styles.bodyFontSize, styles.originalCardText]}>
            {item.ingredient}
          </Text>
        </View>
      );
    }
  } else {
    //Render Card for Editing Purpose
    return (
      <View style={styles.moddedCard}>
        <View style={styles.rowView}>
          <TextInput
            style={[styles.textInput, { flex: 1.5 }]}
            keyboardType={"numeric"}
            numeric
            value={`${item.ingredientDetails.amount}`}
            onChangeText={(text) => {
              //Remove any non-numeric values, excluding dot
              text = text.replace(/[^0-9\.]/g, "");
              handlequantityupdate(item, text);
            }}
            maxLength={6}
          />
          <TouchableOpacity
            onPress={() => {
              let unitClass = calldetermineclass(item.ingredientDetails.unit);
              selectUnitModal(item, unitClass.unit);
            }}
          >
            <View style={[styles.textInput, styles.unitBox]}>
              <Text>{item.ingredientDetails.unit}</Text>
            </View>
          </TouchableOpacity>
          <TextInput
            style={[styles.textInput, { flex: 6 }]}
            value={item.ingredientDetails.name}
            onChangeText={(text) => {
              //Remove any non-alphanumeric and non-blank space character
              text = text.replace(/[^A-Za-z0-9\s]/g, "");
              //Replace one or more blank spaces with a single blank space. Prevents multiple spaces between words
              text = text.replace(/\s+/g, " ");
              handlenameupdate(item, text);
            }}
            maxLength={40}
          />
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handledelete(index)}
          >
            <Ionicons name="ios-close" size={32} color="rgba(0,0,0,0.5)" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
};

export default class ConfirmItemModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showUndo: false,
      refresh: false,
    };
    //Variables to store ingredients to be edited
    this.editArray = [];
    this.undoArray = [];

    this.handleNameUpdate = this.handleNameUpdate.bind(this);
    this.handleQuantityUpdate = this.handleQuantityUpdate.bind(this);
    this.handleUnitUpdate = this.handleUnitUpdate.bind(this);
    this.callDetermineClass = this.callDetermineClass.bind(this);
    this.callUnitModal = this.callUnitModal.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.originalIngredients = JSON.parse(
      JSON.stringify(this.props.route.params.originalIngredients)
    );
    this.modIngredients = JSON.parse(
      JSON.stringify(this.props.route.params.modIngredients)
    );
    this.title = this.props.route.params.recipeTitle;
    this.url = this.props.route.params.recipeURL;
  }

  componentDidMount() {
    this.buildDataArray();
  }
  componentWillUnmount() {}
  //Build the data list with alternating original ingredients and modded ingredients
  buildDataArray() {
    DATA = [];
    let originalLength = this.originalIngredients.length;
    let modLength = this.modIngredients.length;

    //Handle items with "And", excluding half and half
    if (modLength > originalLength) {
      //In case of multiple "ands"
      let modCount = 0;
      for (let i = 0; i < originalLength; i++) {
        let originalItem = {};
        let modItem = {};
        let itemFound = false; //True when "and" is found
        //Search for one or more blank spaces and replace with single blank space
        let originalIngredient = this.originalIngredients[i].replace(
          /\s+/g,
          " "
        );
        let commaRemovedString = originalIngredient.split(",", 1);
        let searchArray = commaRemovedString[0].split(" ");
        for (let splitWord of searchArray) {
          if (splitWord === "And" || splitWord === "and") {
            itemFound = true;
            break;
          }
        }
        if (itemFound) {
          originalItem.ingredient = this.originalIngredients[i];
          this.editArray.push(originalItem);
          modItem.ingredientDetails = this.modIngredients[modCount];
          modItem.firstItem = true;
          this.editArray.push(modItem);
          modCount++;
          originalItem = {};
          originalItem.ingredient = "";
          this.editArray.push(originalItem);
          modItem = {};
          modItem.ingredientDetails = this.modIngredients[modCount];
          modItem.secondItem = true;
          this.editArray.push(modItem);
          modCount++;
          continue;
        }
        originalItem.ingredient = this.originalIngredients[i];
        this.editArray.push(originalItem);
        //Alternate
        modItem.ingredientDetails = this.modIngredients[modCount];
        this.editArray.push(modItem);
        modCount++;
      }
    } else {
      //Normal build
      for (let i = 0; i < originalLength; i++) {
        let originalItem = {};
        let modItem = {};
        originalItem.ingredient = this.originalIngredients[i];
        this.editArray.push(originalItem);
        //Alternate
        modItem.ingredientDetails = this.modIngredients[i];
        this.editArray.push(modItem);
      }
    }
  }
  refreshPage() {
    this.setState({ refresh: !this.state.refresh });
  }
  //Call function to get the unit details of the item
  callDetermineClass(unit) {
    return this.refs.hashfunctions.determineClass(unit);
  }
  handleNameUpdate(item, text) {
    item.ingredientDetails.name = text;
    this.refreshPage();
  }
  handleQuantityUpdate(item, text) {
    item.ingredientDetails.amount = text;
    this.refreshPage();
  }
  handleUnitUpdate(item, unit) {
    if (unit === "No Units") {
      unit = "";
    }
    item.ingredientDetails.unit = unit;
    this.refreshPage();
  }
  callUnitModal(item, unit) {
    this.refs.unitselectconfirm.renderForConfirm(item, unit);
  }
  handleSubmitButton() {
    let ingredientArray = [];
    for (let i = 1; i < this.editArray.length; i += 2) {
      let ingredient = this.editArray[i]
      ingredient.ingredientDetails.name = ingredient.ingredientDetails.name.trim();
      if(ingredient.ingredientDetails.name === "") {
        ingredient.ingredientDetails.name = "No name"
      }
      ingredientArray.push(ingredient.ingredientDetails);
    }
    AddRecipe(ingredientArray, this.title, this.url);
  }
  //Delete items from the state
  handleDelete(index) {
    let deleteItem = {
      originalIngre: this.editArray[index - 1].ingredient,
      modIngre: this.editArray[index].ingredientDetails,
      index: Number(index - 1),
    };
    //Deleted Item is first of "and" item
    if (this.editArray[index].firstItem) {
      if (this.editArray[index + 2].secondItem) {
        this.editArray[index + 1].ingredient = deleteItem.originalIngre;
      }
      deleteItem.firstItem = true;
    }
    if (this.editArray[index].secondItem) {
      deleteItem.secondItem = true;
    }
    this.undoArray.unshift(deleteItem);
    this.editArray.splice(index - 1, 2);
    this.setState({ showUndo: true });
    //Item Completely Removed
    if (this.editArray.length === 0) {
      this.props.navigation.goBack();
    }
  }
  //Undo button - Need to update state to refresh
  handleUndo() {
    let undoItem = this.undoArray[0];
    this.undoArray.splice(0, 1);
    if (this.undoArray.length === 0) {
      this.setState({ showUndo: false });
    }
    //Add items back into the list
    let originalItem = {};
    originalItem.ingredient = undoItem.originalIngre;
    let modItem = {};
    modItem.ingredientDetails = undoItem.modIngre;
    this.editArray.splice(undoItem.index, 0, modItem);
    this.editArray.splice(undoItem.index, 0, originalItem);
    if (undoItem.firstItem) {
      if (this.editArray[undoItem.index + 3].secondItem) {
        this.editArray[undoItem.index + 2].ingredient = "";
        this.editArray[undoItem.index + 1].firstItem = true;
      }
    }
    if (undoItem.secondItem) {
      this.editArray[undoItem.index + 1].secondItem = true;
    }
    this.refreshPage();
  }
  render() {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        //keyboardVerticalOffset={-200}
        style={[styles.editView, styles.container]}
      >
        <View style={styles.headerBar}>
          <View style={styles.closeRowView}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                this.props.navigation.goBack();
              }}
            >
              <MaterialCommunityIcons name="close" size={35} color="#CCC" />
            </TouchableOpacity>
            <View style={{width: screen.width - 110}}/>
              <TouchableOpacity
                onPress={() => this.handleUndo()}
                style={styles.undoButton}
                disabled={!this.state.showUndo}
              >
                {/* <MaterialIcons name="undo" size={35} color="dodgerblue" /> */}
                <MaterialCommunityIcons
                  name="undo-variant"
                  size={35}
                  color={this.state.showUndo? "dodgerblue" : "transparent"}
                />
              </TouchableOpacity>
          </View>
          <View style={styles.rowView}>
            <Text style={[styles.text, styles.headerText]}>
              Confirm Ingredients
            </Text>
            {/* <View style={{ marginTop: 3 }}>
              <Ionicons name="ios-checkmark-circle" size={24} color="green" />
            </View> */}
          </View>
        </View>
        <FlatList
          style={{ backgroundColor: "white" }}
          showsVerticalScrollIndicator={false}
          data={this.editArray}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <RenderItemCard
              item={item}
              index={index}
              handlenameupdate={this.handleNameUpdate}
              handlequantityupdate={this.handleQuantityUpdate}
              selectUnitModal={this.callUnitModal}
              calldetermineclass={this.callDetermineClass}
              handledelete={this.handleDelete}
            />
          )}
          ListFooterComponent={
            <Button
              style={styles.confirmButton}
              onPress={() => {
                this.handleSubmitButton();
                this.props.navigation.navigate("Recipe", {addedToList: true});
              }}
              text={`Add to grocery list`}
              textStyle={styles.buttonText}
            />
          }
        />
        <UnitSelectModal
          ref={"unitselectconfirm"}
          unitUpdate={this.handleUnitUpdate}
        />
        <HashFunctions ref={"hashfunctions"} />
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    paddingHorizontal: 5,
    backgroundColor: "#F9F9F9",
    flex: 1,
  },
  headerText: {
    fontSize: 25,
    color: "#778899",
    margin: 10,
  },
  headerBar: {
    backgroundColor: "white",
    justifyContent: "space-between",
  },
  bodyFontSize: {
    fontSize: 17,
  },
  originalCardText: {
    color: "#696969",
  },
  closeRowView: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    alignSelf: "center",
  },
  rowView: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  originalCard: {
    flex: 1,
    // borderTopWidth: 1,
    // borderTopColor: "#E8E8E8",
    marginTop: 12,
    paddingVertical: 5,
    justifyContent: "flex-start",
    paddingLeft: 7,
  },
  moddedCard: {
    flex: 1,
    paddingBottom: 10,
  },
  closeButton: {
    marginHorizontal: 10,
    marginTop: 5,
    alignSelf: "center",
  },
  undoButton: {
    marginHorizontal: 10,
    marginTop: 5,
  },
  textInput: {
    height: 30,
    padding: 5,
    borderColor: "#CCC",
    borderBottomWidth: 1,
    borderRadius: 5,
    backgroundColor: "white",
    marginHorizontal: 5,
  },
  unitBox: {
    width: 90,
    borderWidth: 1,
  },
  confirmButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: "white",
    marginTop: 10,
    marginBottom: 15,
    backgroundColor: "dodgerblue",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 17,
  },
  editView: {
    flex: 1,
  },
  deleteButton: {
    paddingRight: 12,
  },
  text: {
    fontFamily: "SourceSansPro",
  },
});

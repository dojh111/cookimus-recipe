import React, { Component, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from "react-native";
import { FontAwesome, MaterialIcons, Entypo } from '@expo/vector-icons';
import RecipeList from '../../../data/RecipeList'
const frac = require('frac');

const Item = ({ title, amounts, units, mark, editState, itemKey, handlenameupdate, handlequantityupdate, selectUnitModal, index, forceRefresh, updateeditarray }) => {
  let fracArray = frac(amounts, 20, true);
  let final = '';
  //Conversion to fractions
  if (fracArray[2] === 1) {
    final = amounts;
    if (final === 0) { final = ''; }
  } else {
    if (fracArray[0] === 0) {
      final = fracArray[1].toString() + '/' + fracArray[2].toString();
    }
    else {
      final = fracArray[0].toString() + '"' + fracArray[1].toString() + '/' + fracArray[2].toString();
    }
  }
  let icon =
    (editState) ? <MaterialIcons name="edit" size={24} color="cornflowerblue" /> :
      (mark === undefined || mark === false) ? <FontAwesome name="circle-thin" size={17} color="#ccc" /> : <FontAwesome name="check" size={14} color="green" />;
  let checkStyle = (mark === undefined || mark === false) ? [styles.ingredientText, styles.text] : [styles.ingredientValueText, styles.text];

  if (title === "Add Item...") {
    let addIcon = <Entypo name="plus" size={22} color="mediumseagreen" />;
    return addItemCard(addIcon, title, index, forceRefresh, updateeditarray);
  } else {
    return (editState) ? editCard(icon, title, amounts, units, itemKey, handlenameupdate, handlequantityupdate, selectUnitModal) : itemCard(icon, checkStyle, title, final, units);
  }
};

//Render normal item card
const itemCard = (icon, checkStyle, title, final, units) => {
  if (title === "No Name Found") {
    checkStyle = [styles.ingredientText, styles.text, styles.errorText];
  }
  return (
    < View style={styles.ingredientEntry} >
      <Text style={checkStyle}>{icon}  {title}</Text>
      <Text style={[styles.ingredientValueText, styles.text]}>
        {final} {units}
      </Text>
    </View >
  )
}

//Render edit mode item card
const editCard = (icon, title, amounts, units, itemKey, handlenameupdate, handlequantityupdate, selectUnitModal) => {
  const [newValue, setNewValue] = useState(amounts);
  return (
    < View
      style={[styles.editMode]}
    >
      {icon}
      <TextInput
        style={styles.textInput}
        width={140}
        placeholder={title}
        value={title}
        onChangeText={(text) => handlenameupdate(text, itemKey)}
      />
      <TextInput
        style={styles.textInput}
        width={50}
        keyboardType={"numeric"}
        numeric
        //placeholder={amounts.toString()}
        value={`${newValue}`}
        onChangeText={(text) => {
          setNewValue(text);
          handlequantityupdate(text, itemKey);
        }}
      />
      <TouchableOpacity
        onPress={() => selectUnitModal(itemKey)}
      >
        <View style={[styles.textInput, styles.unitBox]}>
          <Text>{units}</Text>
        </View>
      </TouchableOpacity>
    </View >
  )
}

//Render card with add item functionality on press
const addItemCard = (icon, title, index, forceRefresh, updateeditarray) => {
  return (
    <TouchableOpacity
      onPress={() => {
        handleAddItem(index, updateeditarray);
        forceRefresh();
      }}
    >
      < View style={[styles.ingredientEntry, styles.addItemBackGround]} >
        <Text style={[styles.ingredientText, styles.text, styles.addItemText]}>{icon}  {title}</Text>
      </View >
    </TouchableOpacity>
  )
}

//Adds another row into the recipe list
const handleAddItem = (index, updateeditarray) => {
  //Add item into second last slot of array before add item card
  let slotIndex = RecipeList[index].data.length - 1;
  let newItemObject = {name: "", amount: "", unit: "", unitDetails: { unit: "", class: 0 }};
  newItemObject.key = `${newItemObject.name}.${index}.${slotIndex}`;
  RecipeList[index].data.splice(slotIndex, 0, newItemObject);
  updateeditarray(newItemObject.key);
}

const styles = StyleSheet.create({
  //For each ingredient entry
  ingredientEntry: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "white",
  },
  text: {
    fontFamily: "SourceSansPro",
  },
  //Ingredient Card Text
  ingredientText: {
    fontSize: 18,
  },
  errorText: {
    color: "red",
  },
  ingredientValueText: {
    fontSize: 18,
    color: "#A9A9A9",
  },
  addItemText: {
    color: "#808080",
  },
  addItemBackGround: {
    backgroundColor: "#E8E8E8",
  },
  textInput: {
    height: 30,
    padding: 5,
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "white",
  },
  editMode: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "white",
  },
  nameInput: {
    width: 130,
  },
  unitBox: {
    width: 100,
  }
});

export default Item;

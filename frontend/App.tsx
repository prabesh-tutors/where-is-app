import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { RootStackParamList } from "./src/navigation/types";
import HomeScreen from "./src/screens/HomeScreen";
import ListItemsScreen from "./src/screens/ListItemsScreen";
import AddItemScreen from "./src/screens/AddItemScreen";
import ItemDetailsScreen from "./src/screens/ItemDetailsScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Where Is" }}
        />
        <Stack.Screen
          name="ListItems"
          component={ListItemsScreen}
          options={{ title: "Items" }}
        />
        <Stack.Screen
          name="AddItem"
          component={AddItemScreen}
          options={{ title: "Add item" }}
        />
        <Stack.Screen
          name="ItemDetails"
          component={ItemDetailsScreen}
          options={{ title: "Details" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

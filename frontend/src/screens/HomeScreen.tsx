import React from "react";
import { View, Button, Text } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={{ flex: 1, padding: 16, justifyContent: "center", gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: "700", textAlign: "center" }}>
        Where Is
      </Text>

      <Button title="Add new" onPress={() => navigation.navigate("AddItem")} />
      <Button title="List items" onPress={() => navigation.navigate("ListItems")} />
    </View>
  );
}

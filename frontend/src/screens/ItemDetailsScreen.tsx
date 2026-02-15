import React, { useCallback, useState } from "react";
import { View, Text, Image, Button, Alert } from "react-native";
import ItemMap from "../components/ItemMap";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { getItemById, deleteItem, Item } from "../api/itemsApi";
import { useFocusEffect } from "@react-navigation/native";



type Props = NativeStackScreenProps<RootStackParamList, "ItemDetails">;

export default function ItemDetailsScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const [item, setItem] = useState<Item | null>(null);
  const [error, setError] = useState("");

useFocusEffect(
  useCallback(() => {
    let alive = true;

    (async () => {
      try {
        setError("");
        const data = await getItemById(id);
        if (alive) setItem(data);
      } catch (e: any) {
        if (alive) setError(e?.message ?? "Unknown error");
      }
    })();

    return () => {
      alive = false;
    };
  }, [id])
);


  const confirmDelete = () => {
    Alert.alert("Delete item?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteItem(id);
          navigation.goBack();
        },
      },
    ]);
  };

  if (error) {
    return (
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {!item ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <Text style={{ fontSize: 20, fontWeight: "800" }}>{item.name}</Text>

          <Text style={{ marginTop: 8 }}>{item.description}</Text>

          {item.gps ? (
            <ItemMap lat={item.gps.lat} lng={item.gps.lng} label={item.name} />
          ) : (
            <Text style={{ marginTop: 12, color: "gray" }}>No GPS saved</Text>
          )}

          {/* PHOTO */}
          {item.photoUrl ? (
            <Image
              source={{ uri: item.photoUrl }}
              style={{
                width: "100%",
                height: 260,
                marginTop: 12,
                borderRadius: 8,
              }}
              resizeMode="cover"
            />
          ) : (
            <Text style={{ marginTop: 12 }}>No photo saved</Text>
          )}

          <View style={{ marginTop: 12, gap: 10 }}>
  <Button
    title="Update item"
    onPress={() => navigation.navigate("EditItem", { id })}
  />
  <Button title="Delete item" onPress={confirmDelete} />
</View>
        </>
      )}
    </View>
  );
}

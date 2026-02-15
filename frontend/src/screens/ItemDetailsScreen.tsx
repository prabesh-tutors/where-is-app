import React, { useEffect, useState } from "react";
import { View, Text, Image, Button, Alert } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { getItemById, deleteItem, Item } from "../api/itemsApi";

type Props = NativeStackScreenProps<RootStackParamList, "ItemDetails">;

export default function ItemDetailsScreen({ route, navigation }: Props) {
  const { id } = route.params;

  const [item, setItem] = useState<Item | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setError("");
        const data = await getItemById(id);
        setItem(data);
      } catch (e: any) {
        setError(e?.message ?? "Unknown error");
      }
    })();
  }, [id]);

  const confirmDelete = () => {
    Alert.alert("Delete item?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteItem(id);
            navigation.goBack();
          } catch (e: any) {
            setError(e?.message ?? "Failed to delete item");
          }
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}

      {!item ? (
        <Text style={{ marginTop: 12 }}>Loading...</Text>
      ) : (
        <>
          <Text style={{ fontSize: 20, fontWeight: "800" }}>{item.name}</Text>

          <Text style={{ marginTop: 8 }}>{item.description}</Text>

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
            <Text style={{ marginTop: 12, color: "gray" }}>
              No photo saved for this item.
            </Text>
          )}

          <View style={{ marginTop: 12 }}>
            <Button title="Delete item" onPress={confirmDelete} />
          </View>
        </>
      )}
    </View>
  );
}

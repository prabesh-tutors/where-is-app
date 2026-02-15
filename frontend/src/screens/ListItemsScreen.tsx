import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, RefreshControl } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { getItems, Item } from "../api/itemsApi";
import { useFocusEffect } from "@react-navigation/native";


type Props = NativeStackScreenProps<RootStackParamList, "ListItems">;

export default function ListItemsScreen({ navigation }: Props) {
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await getItems();
      setItems(data);
    } catch (e: any) {
      setError(e?.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  };

useFocusEffect(
  React.useCallback(() => {
    load();
  }, [])
);


  return (
    <View style={{ flex: 1, padding: 16 }}>
      {error ? (
        <Text style={{ color: "red", marginBottom: 8 }}>{error}</Text>
      ) : null}

      <FlatList
        data={items}
        keyExtractor={(it) => it._id}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={load} />
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              navigation.navigate("ItemDetails", { id: item._id })
            }
            style={{ paddingVertical: 12, borderBottomWidth: 1 }}
          >
            <Text style={{ fontWeight: "700" }}>{item.name}</Text>
            <Text>{item.description}</Text>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={{ marginTop: 16 }}>
            {loading ? "Loading..." : "No items yet."}
          </Text>
        }
      />
    </View>
  );
}

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  RefreshControl,
  Image,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { getItems, Item } from "../api/itemsApi";
import { API_BASE_URL } from "../config/api";

type Props = NativeStackScreenProps<RootStackParamList, "ListItems">;

export default function ListItemsScreen({ navigation }: Props) {
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getPhotoUri = (photoUrl?: string) => {
    if (!photoUrl) return undefined;
    return photoUrl.startsWith("http")
      ? photoUrl
      : `${API_BASE_URL}${photoUrl}`;
  };

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
    useCallback(() => {
      load();
    }, [])
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}

      <FlatList
        data={items}
        keyExtractor={(it) => it._id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate("ItemDetails", { id: item._id })}
            style={{
              paddingVertical: 12,
              borderBottomWidth: 1,
              flexDirection: "row",
              gap: 12,
              alignItems: "center",
            }}
          >
            {item.photoUrl ? (
              <Image
                source={{ uri: getPhotoUri(item.photoUrl) }}
                style={{ width: 56, height: 56, borderRadius: 8 }}
                resizeMode="cover"
              />
            ) : (
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 8,
                  borderWidth: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: "gray", fontSize: 12 }}>No photo</Text>
              </View>
            )}

            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "700" }}>{item.name}</Text>
              <Text numberOfLines={2}>{item.description}</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

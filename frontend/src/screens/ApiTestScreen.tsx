import React, { useState } from "react";
import { View, Text, Button, ScrollView } from "react-native";
import { getItems, Item } from "../api/itemsApi";

export default function ApiTestScreen() {
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState<string>("");

  const handleLoad = async () => {
    try {
      setError("");
      const data = await getItems();
      setItems(data);
    } catch (e: any) {
      setError(e?.message ?? "Unknown error");
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Button title="Load items from backend" onPress={handleLoad} />

      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}

      <ScrollView>
        {items.map((it) => (
          <View key={it._id} style={{ paddingVertical: 8 }}>
            <Text style={{ fontWeight: "700" }}>{it.name}</Text>
            <Text>{it.description}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

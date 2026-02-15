import React from "react";
import { View, Text, Pressable, Linking } from "react-native";

type Props = {
  lat: number;
  lng: number;
  label?: string;
};

export default function ItemMap({ lat, lng, label }: Props) {
  const url = `https://www.google.com/maps?q=${lat},${lng}`;

  return (
    <View style={{ marginTop: 12 }}>
      <Text style={{ fontWeight: "700", marginBottom: 8 }}>
        Location
      </Text>

      <Pressable
        onPress={() => Linking.openURL(url)}
        style={{
          borderWidth: 1,
          borderRadius: 8,
          padding: 12,
        }}
      >
        <Text style={{ fontWeight: "700" }}>
          Open in Google Maps
        </Text>

        <Text style={{ marginTop: 4 }}>
          {label ? `${label} — ` : ""}
          {lat.toFixed(6)}, {lng.toFixed(6)}
        </Text>
      </Pressable>
    </View>
  );
}

import React from "react";
import { View, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";

type Props = {
  lat: number;
  lng: number;
  label?: string;
};

export default function ItemMap({ lat, lng, label }: Props) {
  return (
    <View style={{ marginTop: 12 }}>
      <Text style={{ fontWeight: "700", marginBottom: 8 }}>
        Location
      </Text>

      <MapView
        style={{ width: "100%", height: 220, borderRadius: 8 }}
        initialRegion={{
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{ latitude: lat, longitude: lng }}
          title={label ?? "Saved location"}
        />
      </MapView>
    </View>
  );
}

import React, { useState } from "react";
import { View, Text, Button, Image, TextInput, Keyboard } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { createItem, uploadPhoto } from "../api/itemsApi";

export default function AddItemScreen() {
  const [photoUri, setPhotoUri] = useState<string>("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [gps, setGps] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const takePhoto = async () => {
    Keyboard.dismiss();
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      alert("Camera permission is required.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const getGps = async () => {
    Keyboard.dismiss();
    const perm = await Location.requestForegroundPermissionsAsync();
    if (perm.status !== "granted") {
      alert("Location permission is required to save GPS.");
      return;
    }

    const pos = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    setGps({
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
    });
  };

  const handleSave = async () => {
    setError("");

    if (!name.trim()) return setError("Name is required.");
    if (!description.trim())
      return setError("Description is required.");
    if (!photoUri) return setError("Photo is required (grade 5).");

    try {
      setSaving(true);

      // 1️⃣ Upload image to backend
      const photoUrl = await uploadPhoto(photoUri);

      // 2️⃣ Save item with returned URL (GPS not sent yet in this step)
      await createItem({
        name: name.trim(),
        description: description.trim(),
        photoUrl,
        gps: gps ?? undefined,
      });

      // Reset form
      setName("");
      setDescription("");
      setPhotoUri("");
      setGps(null);

      alert("Item has been added successfully!");
    } catch (e: any) {
      setError(e?.message ?? "Failed to save item");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "700" }}>Add Item</Text>

      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}

      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Item name"
        style={{ borderWidth: 1, padding: 10, borderRadius: 8 }}
      />

      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Description"
        style={{ borderWidth: 1, padding: 10, borderRadius: 8 }}
      />

      <Button title="Take photo" onPress={takePhoto} />

      {photoUri ? (
        <Image
          source={{ uri: photoUri }}
          style={{ width: "100%", height: 260, borderRadius: 8 }}
          resizeMode="cover"
        />
      ) : (
        <Text style={{ color: "gray" }}>No photo taken yet.</Text>
      )}

      <Button title="Get GPS (optional)" onPress={getGps} />

      {gps ? (
        <Text>
          GPS: {gps.lat.toFixed(6)}, {gps.lng.toFixed(6)}
        </Text>
      ) : (
        <Text style={{ color: "gray" }}>No GPS location.</Text>
      )}

      <Button
        title={saving ? "Saving..." : "Save item"}
        disabled={saving}
        onPress={handleSave}
      />

      
    </View>
  );
}

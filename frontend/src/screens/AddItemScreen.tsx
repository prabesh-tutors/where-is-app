import React, { useState } from "react";
import { View, Text, Button, Image, TextInput } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { createItem, uploadPhoto } from "../api/itemsApi";

export default function AddItemScreen() {
  const [photoUri, setPhotoUri] = useState<string>("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const takePhoto = async () => {
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

  const handleSave = async () => {
    setError("");

    if (!name.trim()) return setError("Name is required.");
    if (!description.trim())
      return setError("Description/location is required.");
    if (!photoUri) return setError("Photo is required (grade 5).");

    try {
      setSaving(true);

      // 1️⃣ Upload image to backend
      const photoUrl = await uploadPhoto(photoUri);

      // 2️⃣ Save item with returned URL
      await createItem({
        name: name.trim(),
        description: description.trim(),
        photoUrl,
      });

      // Reset form
      setName("");
      setDescription("");
      setPhotoUri("");

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
        placeholder="Description / location"
        style={{ borderWidth: 1, padding: 10, borderRadius: 8 }}
      />

      <Button title="Take photo" onPress={takePhoto} />

      <Button
        title={saving ? "Saving..." : "Save item"}
        disabled={saving}
        onPress={handleSave}
      />

      {photoUri ? (
        <Image
          source={{ uri: photoUri }}
          style={{ width: "100%", height: 260, borderRadius: 8 }}
          resizeMode="cover"
        />
      ) : (
        <Text style={{ color: "gray" }}>No photo taken yet.</Text>
      )}
    </View>
  );
}

import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Image, Keyboard } from "react-native";
import * as ImagePicker from "expo-image-picker";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { getItemById, updateItem, uploadPhoto } from "../api/itemsApi";

type Props = NativeStackScreenProps<RootStackParamList, "EditItem">;

export default function EditItemScreen({ route, navigation }: Props) {
  const { id } = route.params;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState<string | undefined>(
    undefined
  );

  // new photo taken (local uri)
  const [newPhotoUri, setNewPhotoUri] = useState<string>("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setError("");
        setLoading(true);
        const item = await getItemById(id);
        setName(item.name ?? "");
        setDescription(item.description ?? "");
        setCurrentPhotoUrl(item.photoUrl);
      } catch (e: any) {
        setError(e?.message ?? "Failed to load item");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const takeNewPhoto = async () => {
    Keyboard.dismiss();
    setError("");

    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      alert("Camera permission is required.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
    });

    if (!result.canceled) {
      setNewPhotoUri(result.assets[0].uri);
    }
  };

  const handleUpdate = async () => {
    Keyboard.dismiss();
    setError("");

    if (!name.trim()) return setError("Name is required.");
    if (!description.trim())
      return setError("Description/location is required.");

    try {
      setSaving(true);

      // If user took a new photo → upload it and get new URL
      let photoUrlToSave = currentPhotoUrl;

      if (newPhotoUri) {
        photoUrlToSave = await uploadPhoto(newPhotoUri);
      }

      await updateItem(id, {
        name: name.trim(),
        description: description.trim(),
        photoUrl: photoUrlToSave, // ✅ triggers backend cleanup if changed
      });

      navigation.goBack();
    } catch (e: any) {
      setError(e?.message ?? "Failed to update item");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "700" }}>Update Item</Text>

      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}

      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <>
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

          <Button title="Take new photo (replace)" onPress={takeNewPhoto} />

          {/* Preview: new photo if taken, otherwise current photoUrl */}
          {newPhotoUri ? (
            <Image
              source={{ uri: newPhotoUri }}
              style={{ width: "100%", height: 260, borderRadius: 8 }}
              resizeMode="cover"
            />
          ) : currentPhotoUrl ? (
            <Image
              source={{ uri: currentPhotoUrl }}
              style={{ width: "100%", height: 260, borderRadius: 8 }}
              resizeMode="cover"
            />
          ) : (
            <Text style={{ color: "gray" }}>No photo saved</Text>
          )}

          <Button
            title={saving ? "Updating..." : "Update item"}
            onPress={handleUpdate}
            disabled={saving}
          />
        </>
      )}
    </View>
  );
}

import { API_BASE_URL } from "../config/api";

export type Item = {
  _id: string;
  name: string;
  description: string;
  photoUrl?: string;
  gps?: { lat: number; lng: number };
  createdAt: string;
  updatedAt: string;
};

export async function getItems(q?: string): Promise<Item[]> {
  const url =
    q && q.trim()
      ? `${API_BASE_URL}/items?q=${encodeURIComponent(q.trim())}`
      : `${API_BASE_URL}/items`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch items");
  return res.json();
}

export async function getItemById(id: string): Promise<Item> {
  const res = await fetch(`${API_BASE_URL}/items/${id}`);
  if (!res.ok) throw new Error("Failed to fetch item");
  return res.json();
}

export async function createItem(input: {
  name: string;
  description: string;
  photoUrl: string;
  gps?: { lat: number; lng: number };
}) {
  const res = await fetch(`${API_BASE_URL}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) throw new Error("Failed to create item");
  return res.json();
}

export async function updateItem(
  id: string,
  input: {
    name?: string;
    description?: string;
    photoUrl?: string | null;
    gps?: { lat: number; lng: number } | null;
  }
) {
  const res = await fetch(`${API_BASE_URL}/items/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) throw new Error("Failed to update item");
  return res.json();
}

export async function deleteItem(id: string) {
  const res = await fetch(`${API_BASE_URL}/items/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete item");
}

export async function uploadPhoto(photoUri: string): Promise<string> {
  const formData = new FormData();

  formData.append("photo", {
    uri: photoUri,
    name: "photo.jpg",
    type: "image/jpeg",
  } as any);

  const res = await fetch(`${API_BASE_URL}/uploads`, {
    method: "POST",
    body: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (!res.ok) throw new Error("Upload failed");

  const data = await res.json();

  // ✅ store only relative path, e.g. "/uploads/abc.jpg"
  return data.urlPath;
}

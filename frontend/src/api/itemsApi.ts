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
  const url = q
    ? `${API_BASE_URL}/items?q=${encodeURIComponent(q)}`
    : `${API_BASE_URL}/items`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch items (${res.status})`);
  }

  return res.json();
}

export async function getItemById(id: string): Promise<Item> {
  const res = await fetch(`${API_BASE_URL}/items/${id}`);

  if (!res.ok) {
    throw new Error(`Failed to fetch item (${res.status})`);
  }

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

export async function deleteItem(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/items/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to delete item (${res.status}) ${text}`);
  }
}

export async function uploadPhoto(photoUri: string): Promise<string> {
  const formData = new FormData();

  // Try to keep original extension if possible
  const filename = photoUri.split("/").pop() || `photo_${Date.now()}.jpg`;
  const ext = filename.split(".").pop()?.toLowerCase();
  const mime =
    ext === "png"
      ? "image/png"
      : ext === "jpg" || ext === "jpeg"
      ? "image/jpeg"
      : "image/jpeg";

  formData.append("photo", {
    uri: photoUri,
    name: filename,
    type: mime,
  } as any);

  const res = await fetch(`${API_BASE_URL}/uploads`, {
    method: "POST",
    body: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Photo upload failed (${res.status}) ${text}`);
  }

  const data = await res.json(); // { urlPath: "/uploads/..." }

  // Return full public URL to store in MongoDB
  return `${API_BASE_URL}${data.urlPath}`;
}

export async function updateItem(
  id: string,
  input: {
    name?: string;
    description?: string;
    photoUrl?: string;
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

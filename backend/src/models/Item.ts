import { Schema, model } from "mongoose";

export type ItemDocument = {
  name: string;
  description: string;
  photoUrl?: string; // later (we’ll store image path/url)
  createdAt: Date;
  updatedAt: Date;
};

const itemSchema = new Schema<ItemDocument>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    photoUrl: { type: String, required: false },
  },
  { timestamps: true }
);

export const Item = model<ItemDocument>("Item", itemSchema);

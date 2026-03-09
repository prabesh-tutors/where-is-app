import { Schema, model } from "mongoose";

export type ItemDocument = {
  name: string;
  description: string;
  photoUrl?: string;

  // ✅ optional GPS
  gps?: {
    lat: number;
    lng: number;
  };

  createdAt: Date;
  updatedAt: Date;
};

const itemSchema = new Schema<ItemDocument>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    photoUrl: { type: String, required: false },

    // ✅ optional GPS object
    gps: {
      lat: { type: Number, required: false },
      lng: { type: Number, required: false },
    },
  },
  { timestamps: true }
);

export const Item = model<ItemDocument>("Item", itemSchema);

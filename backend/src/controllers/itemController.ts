import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Item } from "../models/Item";
import fs from "fs/promises";
import path from "path";


export const createItem = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, photoUrl } = req.body;

  if (!name || !description) {
    res.status(400);
    throw new Error("Name and description are required");
  }

  const newItem = await Item.create({
    name,
    description,
    photoUrl,
  });

  res.status(201).json(newItem);
});

// GET /items?q=...
export const getItems = asyncHandler(async (req: Request, res: Response) => {
  const q = typeof req.query.q === "string" ? req.query.q.trim() : "";

  const filter: Record<string, any> = {};

  if (q) {
    filter.name = { $regex: q, $options: "i" };
  }

  const items = await Item.find(filter).sort({ createdAt: -1 });

  res.json(items);
});

// GET /items/:id
export const getItemById = asyncHandler(async (req: Request, res: Response) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error("Item not found");
  }

  res.json(item);
});

// PUT /items/:id
export const updateItem = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, photoUrl } = req.body;

  // Allow partial updates, but if a field is provided it must not be empty
  const update: Record<string, any> = {};

  if (name !== undefined) {
    if (!name) {
      res.status(400);
      throw new Error("Name cannot be empty");
    }
    update.name = name;
  }

  if (description !== undefined) {
    if (!description) {
      res.status(400);
      throw new Error("Description cannot be empty");
    }
    update.description = description;
  }

  if (photoUrl !== undefined) {
    update.photoUrl = photoUrl;
  }

  const updated = await Item.findByIdAndUpdate(req.params.id, update, {
    new: true,
    runValidators: true,
  });

  if (!updated) {
    res.status(404);
    throw new Error("Item not found");
  }

  res.json(updated);
});

// DELETE /items/:id
export const deleteItem = asyncHandler(async (req: Request, res: Response) => {
  const deleted = await Item.findByIdAndDelete(req.params.id);

  if (!deleted) {
    res.status(404);
    throw new Error("Item not found");
  }

  // If the item had an uploaded photo, delete the file from /uploads
  const photoUrl = deleted.photoUrl;
  if (photoUrl) {
    // Works for both:
    // - "/uploads/abc.png"
    // - "http://10.143.163.214:4000/uploads/abc.png"
    const match = photoUrl.match(/\/uploads\/([^/?#]+)/);
    const filename = match?.[1];

    if (filename) {
      const filePath = path.join(process.cwd(), "uploads", filename);

      try {
        await fs.unlink(filePath);
        console.log("🗑️ Deleted uploaded photo:", filePath);
      } catch (err: any) {
        // Don't fail the whole request if file is already missing
        if (err?.code !== "ENOENT") {
          console.warn("⚠️ Failed to delete uploaded photo:", err?.message ?? err);
        }
      }
    }
  }

  res.json({ message: "Item deleted" });
});


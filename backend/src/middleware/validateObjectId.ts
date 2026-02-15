import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export const validateObjectId = (req: Request, res: Response, next: NextFunction) => {
  const id = String(req.params.id);


  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid item id" });
  }

  next();
};

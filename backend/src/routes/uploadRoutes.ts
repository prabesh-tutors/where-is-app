import { Router } from "express";
import multer from "multer";
import path from "path";
import crypto from "crypto";

const router = Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg";
    const name = crypto.randomBytes(16).toString("hex") + ext.toLowerCase();
    cb(null, name);
  },
});

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (file.mimetype.startsWith("image/")) return cb(null, true);
  cb(new Error("Only image uploads are allowed"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
});

router.post("/", upload.single("photo"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  // IMPORTANT: For LAN access, use your LAN IP in frontend base URL.
  // Here we return a relative URL to keep it flexible.
  const urlPath = `/uploads/${req.file.filename}`;

  res.status(201).json({ urlPath });
});

export default router;

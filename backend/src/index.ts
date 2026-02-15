import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import dns from "dns";
import itemRoutes from "./routes/itemRoutes";
import { notFound, errorHandler } from "./middleware/errorMiddleware";
import path from "path";
import uploadRoutes from "./routes/uploadRoutes";





// force public DNS for SRV lookups (fixes ECONNREFUSED on some networks)
dns.setServers(["8.8.8.8", "8.8.4.4"]);



dotenv.config();

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  throw new Error("MONGODB_URI is missing in .env");
}

mongoose
  .connect(mongoUri)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });


const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "where-is-backend" });
});

app.use("/uploads", uploadRoutes);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/items", itemRoutes);

app.use(notFound);
app.use(errorHandler);


const port = Number(process.env.PORT) || 4000;
app.listen(port, "0.0.0.0", () => {
  console.log(`API running on http://0.0.0.0:${port}`);
});


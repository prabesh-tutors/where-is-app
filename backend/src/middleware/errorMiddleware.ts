import type { Request, Response, NextFunction } from "express";

export const notFound = (_req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("❌ Server error:", err);

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    message: err?.message || "Server error",
  });
};

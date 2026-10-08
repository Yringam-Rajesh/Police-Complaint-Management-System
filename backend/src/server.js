import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import { seedAdmin } from "./seedAdmin.js";

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173"
}));
app.use(express.json({ limit: "1mb" }));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  standardHeaders: "draft-8",
  legacyHeaders: false
}));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "police-complaint-api" });
});

app.use("/api/auth", authRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/complaints", complaintRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  await seedAdmin();
  app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
  });
});

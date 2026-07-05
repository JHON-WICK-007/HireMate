import dotenv from "dotenv";
// Load environment variables immediately
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import resumeRoutes from "./routes/resume";
import interviewRoutes from "./routes/interview";
import mlRoutes from "./routes/ml";
import aiRoutes from "./routes/ai";
import passport from "passport";


const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ──────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(passport.initialize());

// ─── API Routes ─────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/ml", mlRoutes);
app.use("/api/ai", aiRoutes);

// ─── Health Check Route ─────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "HireMate AI Server is running 🚀",
    timestamp: new Date().toISOString(),
  });
});

// ─── Global Error Handler ───────────────────────────────────
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({
    success: false,
    message: "An unexpected error occurred on the server.",
  });
});

// ─── Start Server ───────────────────────────────────────────
const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  app.listen(PORT, () => {
    console.log(`\n🚀 HireMate AI Server is running!`);
    console.log(`   URL: http://localhost:${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`   Health: http://localhost:${PORT}/api/health\n`);
  });
};

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

export default app; // reload env

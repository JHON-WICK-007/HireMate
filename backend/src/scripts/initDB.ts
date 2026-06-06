import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const initDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) throw new Error("MONGO_URI not defined");

    await mongoose.connect(mongoURI);
    console.log("✅ Connected to MongoDB");

    // Create the 'hiremate' database by inserting an init document
    const db = mongoose.connection.db;
    if (db) {
      await db.collection("app_config").insertOne({
        appName: "HireMate AI",
        version: "1.0.0",
        createdAt: new Date(),
        description: "Intelligent Interview Preparation & Career Development Platform",
      });
      console.log("✅ HireMate database created successfully!");
      console.log('   Database: "hiremate" is now visible in Atlas');
    }

    await mongoose.disconnect();
    console.log("✅ Disconnected. Done!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

initDB();

import connectDB from "./config/db.js";
import app from "./server.js";

export default async function handler(req, res) {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error("DB Error ds:", error);
    res.status(500).json({ message: "Database connection failed" });
  }
}

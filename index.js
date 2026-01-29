const connectDB = require("./config/db");
const app = require("./app");

module.exports = async (req, res) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error("DB Connection Error:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
};

const express = require("express");
const router = express.Router();
const generateUID = require("../utils/generateUID");

router.get("/generate-uid", async (req, res) => {
  try {
    const uid = await generateUID();
    res.json({ uid });
  } catch (err) {
    res.status(500).json({ message: "UID generation failed" });
  }
});

module.exports = router;

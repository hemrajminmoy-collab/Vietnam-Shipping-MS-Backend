const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const { createBulkExpense: bulkCreateExpenses } = require("../Controller/createBulkExpense ");

/**
 * CREATE expense
 */
router.post("/create", async (req, res) => {
  try {
    const { uniqueId, costs, expenseDate, remarks } = req.body;

    if (!uniqueId || !costs?.length) {
      return res.status(400).json({ message: "Invalid expense data" });
    }

    const expense = new Expense({
      uniqueId,
      costs,
      expenseDate,
      remarks,
    });

    await expense.save();
    res.status(201).json({ message: "Expense saved", expense });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/bulk-create", bulkCreateExpenses);

router.get("/all", async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ expenseDate: -1 });
    res.json(expenses);
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET expenses by Unique ID (invoice wise)
 */
router.get("/:uniqueId", async (req, res) => {
  try {
    const expenses = await Expense.find({
      uniqueId: req.params.uniqueId,
    }).sort({ expenseDate: -1 });

    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

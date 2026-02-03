const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const { 
  createBulkExpense: bulkCreateExpenses ,
} = require("../Controller/createBulkExpense");

const { getExpensesWithInvoice } = require("../Controller/expense.controller");

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
router.get("/with-invoice", getExpensesWithInvoice);

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

/**
 * UPDATE expense by ID
 */
router.put("/:id", async (req, res) => {
  try {
    const { invoiceNumber, expenseDate, remarks, costs } = req.body;

    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      {
        invoiceNumber,
        expenseDate,
        remarks,
        costs,
      },
      { new: true }
    );

    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE expense by ID
 */
router.delete("/:id", async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);

    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

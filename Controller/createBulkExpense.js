const Expense = require("../models/Expense");

exports.createBulkExpense = async (req, res) => {
  try {
    const { containerNumbers, expenseDate, remarks, costs } = req.body;

    if (!containerNumbers || containerNumbers.length === 0) {
      return res.status(400).json({ error: "No containers selected" });
    }

    const expense = await Expense.create({
      containerNumbers,        // ✅ array stored ONCE
      expenseDate,
      remarks,
      costs,
      totalAmount: costs.reduce(
        (sum, c) => sum + Number(c.amount || 0),
        0
      ),
    });

    res.status(201).json({
      message: "Bulk expense created successfully",
      data: expense,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Bulk insert failed" });
  }
};

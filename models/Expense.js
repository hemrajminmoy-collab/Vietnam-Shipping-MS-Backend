const mongoose = require("mongoose");

const costItemSchema = new mongoose.Schema(
  {
    costType: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
);

const expenseSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      index: true,
    },
    containerNumbers: {
      type: [String], // ✅ ARRAY
      required: true,
      index: true,
    },

    costs: {
      type: [costItemSchema], // ✅ multiple costs
      required: true,
    },

    expenseDate: {
      type: Date,
      required: true,
    },

    remarks: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Expense", expenseSchema);

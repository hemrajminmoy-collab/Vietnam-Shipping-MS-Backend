import Expense from "../models/Expense";
exports.allExpenses = async(req, res) => {
    try{
        const expenses = await Expense.find().sort({ expenseDate: -1 });
        res.json(expenses);
    }catch(err){
        res.status(500).json({ error: err.message });
    }
};

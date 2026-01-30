const Expense = require("../models/Expense");

exports.getExpensesWithInvoice = async (req, res) => {
  try {
    const data = await Expense.aggregate([
      {
        $lookup: {
          from: "invoices",
          let: { expenseContainers: "$containerNumbers" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $gt: [
                    {
                      $size: {
                        $setIntersection: [
                          "$containerNumber",
                          "$$expenseContainers"
                        ]
                      }
                    },
                    0
                  ]
                }
              }
            }
          ],
          as: "invoiceDetails"
        }
      },
      {
        $addFields: {
          invoiceDetails: { $arrayElemAt: ["$invoiceDetails", 0] }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch expenses with invoices" });
  }
};

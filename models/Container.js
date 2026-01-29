const mongoose = require('mongoose');

const ContainerSchema = new mongoose.Schema({
  uniqueId: { type: String, unique: true, required: true },
  containerNumber: { type: String, required: true },
  sealNumber1: { type: String, required: true },
  sealNumber2: { type: String, default: "" },
  grossWeight: Number,
  netWeight: Number,
  noOfBags: Number,
  status: { type: String, enum: ['Pending', 'Assigned'], default: 'Pending' },
  expenseAdded: {
      type: Boolean,
      default: false,
    },
}, { timestamps: true });

module.exports = mongoose.model('Container', ContainerSchema);
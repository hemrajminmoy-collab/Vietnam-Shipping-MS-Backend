const mongoose = require('mongoose');

const ShipmentSchema = new mongoose.Schema({
  containerIds: [{ type: String }], // Array of Unique IDs
  containerNumber: [{ type: String }],
  invoiceNumber: String,
  blNumber: String,
  grossWeight: Number,
  netWeight: Number,
  noOfBags: Number,
  shippingLine: String,
  goodsName: String,
  arrivalPort: String,
  eta: Date,
  pricePerKgUsd: Number,
  exchangeRate: Number,
  totalValueVnd: Number
}, { timestamps: true });

module.exports = mongoose.model('Shipment', ShipmentSchema);
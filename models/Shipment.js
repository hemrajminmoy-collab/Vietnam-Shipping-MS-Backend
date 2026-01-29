import mongoose from "mongoose";

const ShipmentSchema = new mongoose.Schema(
  {
    containerIds: {
      type: [String],
      index: true,              // 🔥 FAST filtering
    },
    containerNumber: {
      type: [String],
      index: true,
    },
    invoiceNumber: {
      type: String,
      index: true,
    },
    blNumber: {
      type: String,
      index: true,
    },
    grossWeight: Number,
    netWeight: Number,
    noOfBags: Number,
    shippingLine: String,
    goodsName: String,
    arrivalPort: String,
    eta: Date,
    pricePerKgUsd: Number,
    exchangeRate: Number,
    totalValueVnd: Number,
  },
  { timestamps: true }
);

ShipmentSchema.index({ createdAt: -1 }); // 🔥 FAST sorting

export default mongoose.model("Shipment", ShipmentSchema);

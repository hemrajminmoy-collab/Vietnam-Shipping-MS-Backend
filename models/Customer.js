import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    // Shipment / Container fields
    containerNumber: { type: String, index: true },
    invoiceNumber: { type: String },
    blNumber: { type: String },
    sealNumber1: { type: String },
    sealNumber2: { type: String },
    grossWeight: { type: Number },
    netWeight: { type: Number },
    numberOfBags: { type: Number },
    value: { type: Number },
    shippingLine: { type: String },
    nameOfGoods: { type: String },
    arrivalPort: { type: String },

    // Warehouse receipt fields (if relevant)
    warehouseName: { type: String, enum: ["Thanh Binh", "P & C"], default: "Thanh Binh" },
    receivedDate: { type: Date },
    bagsReceived: { type: Number },
    netWeightReceived: { type: Number },
    truckNumber: { type: String },
    truckingAgent: { type: String },
    cha: { type: String },

    // Customer specific
    sellingDirect: { type: Boolean, default: false },
    saleTarget: { type: String, enum: ["warehouse", "customer"], default: "customer" },
    customerName: { type: String },

    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Customer", customerSchema);

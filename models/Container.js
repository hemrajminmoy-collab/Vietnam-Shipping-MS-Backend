import mongoose from "mongoose";

const ContainerSchema = new mongoose.Schema(
  {
    uniqueId: {
      type: String,
      required: true,
      unique: true,
      index: true,              // 🔥 FAST lookups
    },
    containerNumber: {
      type: String,
      required: true,
      index: true,              // 🔥 FAST filters
    },
    sealNumber1: {
      type: String,
      required: true,
    },
    sealNumber2: {
      type: String,
      default: "",
    },
    grossWeight: Number,
    netWeight: Number,
    noOfBags: Number,
    status: {
      type: String,
      enum: ["Pending", "Assigned"],
      default: "Pending",
      index: true,              // 🔥 FAST queries
    },
    expenseAdded: {
      type: Boolean,
      default: false,
      index: true,              // 🔥 FAST billing queries
    },
    shipment_ref: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shipment",
      index: true,              // 🔥 FAST joins
    },
  },
  { timestamps: true }
);

export default mongoose.model("Container", ContainerSchema);

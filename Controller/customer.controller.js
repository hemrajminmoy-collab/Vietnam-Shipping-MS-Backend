import Customer from "../models/Customer.js";

export const createCustomerRecord = async (req, res) => {
  try {
    const payload = req.body;

    let containerNum = payload.containerNumber || "";
    if (Array.isArray(containerNum)) containerNum = containerNum.join(", ");

    const record = new Customer({
      containerNumber: containerNum,
      invoiceNumber: payload.invoiceNumber || "",
      blNumber: payload.blNumber || "",
      sealNumber1: payload.sealNumber1 || "",
      sealNumber2: payload.sealNumber2 || "",
      grossWeight: payload.grossWeight ? Number(payload.grossWeight) : undefined,
      netWeight: payload.netWeight ? Number(payload.netWeight) : undefined,
      numberOfBags: payload.numberOfBags ? Number(payload.numberOfBags) : undefined,
      value: payload.value ? Number(payload.value) : undefined,
      shippingLine: payload.shippingLine || "",
      nameOfGoods: payload.nameOfGoods || "",
      arrivalPort: payload.arrivalPort || "",
      warehouseName: payload.warehouseName || "Thanh Binh",
      receivedDate: payload.receivedDate ? new Date(payload.receivedDate) : new Date(),
      bagsReceived: payload.bagsReceived ? Number(payload.bagsReceived) : undefined,
      netWeightReceived: payload.netWeightReceived ? Number(payload.netWeightReceived) : undefined,
      truckNumber: payload.truckNumber || "",
      truckingAgent: payload.truckingAgent || "",
      cha: payload.cha || "",
      sellingDirect: payload.sellingDirect || false,
      saleTarget: payload.saleTarget || "customer",
      customerName: payload.customerName || "",
      notes: payload.notes || "",
    });

    const saved = await record.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Customer save error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const getAllCustomerRecords = async (req, res) => {
  try {
    const list = await Customer.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteCustomerRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Customer.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Customer record not found" });
    res.json({ message: "Customer record deleted", deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

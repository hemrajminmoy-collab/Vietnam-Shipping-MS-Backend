const express = require("express");
const cors = require("cors");

const uidRouter = require("./Routers/uid.routes");
const expenseRoutes = require("./Routers/expenseRoutes");

const Container = require("./models/Container");
const Shipment = require("./models/Shipment");

const app = express();

/* ---------- Middlewares ---------- */
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json({ limit: "10mb" }));

/* ---------- Routes ---------- */
app.use("/api/expenses", expenseRoutes);
app.use("/api", uidRouter);

/* ---------- Health Check ---------- */
app.get("/", (req, res) => {
  res.status(200).json({ status: "API running 🚀" });
});

/* ---------- Generate Unique ID ---------- */
app.get("/api/generate-id", (req, res) => {
  const id = `ID-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
  res.json({ uniqueId: id });
});

/* ---------- Container ---------- */
app.post("/api/container", async (req, res) => {
  try {
    const container = await Container.create(req.body);
    res.status(201).json(container);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------- Bulk Shipment ---------- */
app.post("/api/shipment/bulk", async (req, res) => {
  try {
    const { containers, ...shipmentData } = req.body;

    const shipment = await Shipment.create({
      ...shipmentData,
      containerIds: containers.map(c => c.uniqueId),
      containerNumber: containers.map(c => c.containerNumber),
    });

    await Promise.all(
      containers.map(c =>
        Container.findOneAndUpdate(
          { uniqueId: c.uniqueId },
          {
            $set: {
              containerNumber: c.containerNumber,
              sealNumber1: c.seal1,
              sealNumber2: c.seal2,
              status: "Assigned",
              shipment_ref: shipment._id,
            },
          },
          { upsert: true, new: true }
        )
      )
    );

    res.json({ success: true, shipment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------- Update Seal ---------- */
app.patch("/api/container/:uniqueId/seal2", async (req, res) => {
  const container = await Container.findOneAndUpdate(
    { uniqueId: req.params.uniqueId },
    { sealNumber2: req.body.sealNumber2 },
    { new: true }
  );
  res.json(container);
});

/* ---------- Fetch ---------- */
app.get("/api/containers/pending", async (req, res) => {
  res.json(await Container.find({ status: "Pending" }));
});

app.get("/api/container/all", async (req, res) => {
  res.json(await Container.find().sort({ createdAt: -1 }));
});

app.get("/api/shipment/all", async (req, res) => {
  res.json(await Shipment.find().sort({ createdAt: -1 }));
});

/* ---------- Update Shipment ---------- */
app.put("/api/shipment/update/:id", async (req, res) => {
  const updated = await Shipment.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

/* ---------- Delete Shipment ---------- */
app.delete("/api/shipment/delete/:id", async (req, res) => {
  await Shipment.findByIdAndDelete(req.params.id);
  await Container.deleteMany({ shipment_ref: req.params.id });
  res.json({ message: "Shipment deleted" });
});

module.exports = app;

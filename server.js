import express from "express";
import cors from "cors";
import compression from "compression";

import uidRouter from "./Routers/uid.Routes.js";
import expenseRoutes from "./Routers/expenseRoutes.js";

import Container from "./models/Container.js";
import Shipment from "./models/Shipment.js";

const app = express();

/* ---------- PERFORMANCE ---------- */
app.disable("x-powered-by");          // Security + tiny speed boost
app.use(compression());               // 🔥 Compress responses
app.use(cors({ origin: "*"}));
app.use(express.json({ limit: "5mb" }));

/* ---------- ROUTES ---------- */
app.use("/api/expenses", expenseRoutes);
app.use("/api", uidRouter);

/* ---------- HEALTH ---------- */
app.get("/", (req, res) => {
  res.json({ status: "API running 🚀" });
});


// 1. Generate Unique ID
app.get('/api/generate-id', (req, res) => {
  const id = `ID-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
  res.json({ uniqueId: id });
});

// 2. Create Initial Container Record
app.post('/api/container', async (req, res) => {
  const container = new Container(req.body);
  await container.save();
  res.json(container);
});

// 3. Bulk Shipment Assignment
app.post('/api/shipment/bulk', async (req, res) => {
  try {
    const { containers, ...shipmentData } = req.body;

    // 1. Save the Shipment first
    const shipment = new Shipment({ 
       ...shipmentData, 
       containerIds: containers.map(c => c.uniqueId), // Store IDs for quick reference
       containerNumber: containers.map(c => c.containerNumber) // Store Container Numbers
    });
    const savedShipment = await shipment.save();

    // 2. Process the Containers
    // We use Promise.all to handle multiple async operations efficiently
    const containerOperations = containers.map(c => {
      return Container.findOneAndUpdate(
        { uniqueId: c.uniqueId }, // Find by Unique ID
        { 
          $set: { 
            containerNumber: c.containerNumber,
            sealNumber1: c.seal1,
            sealNumber2: c.seal2,
            status: 'Assigned',
            shipment_ref: savedShipment._id // <--- THIS LINKS THEM
            
          } 
        },
        { upsert: true, new: true } // Create if doesn't exist, update if it does
      );
    });

    await Promise.all(containerOperations);

    res.json({ success: true, shipment: savedShipment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Update Seal Number 2 (Post-Inspection)
app.patch('/api/container/:uniqueId/seal2', async (req, res) => {
  const container = await Container.findOneAndUpdate(
    { uniqueId: req.params.uniqueId },
    { sealNumber2: req.body.sealNumber2 },
    { new: true }
  );
  res.json(container);
});

app.get('/api/containers/pending', async (req, res) => {
  const containers = await Container.find({ status: 'Pending' });
  res.json(containers);
});

// GET All Shipments
app.get('/api/shipment/all', async (req, res) => {
  try {
    // We fetch all shipments and sort by newest first
const shipments = await Shipment.find()
  .sort({ createdAt: -1 })
  .lean();

    
    // Send the data to the frontend
    res.status(200).json(shipments);
  } catch (err) {
    console.error("Error fetching shipments:", err);
    res.status(500).json({ 
      message: "Server error while fetching shipments", 
      error: err.message 
    });
  }
});
app.get('/api/container/all', async (req, res) => {
  try {
    // We fetch all shipments and sort by newest first
    const container = await Container.find().sort({ createdAt: -1 });
    
    // Send the data to the frontend
    res.status(200).json(container);
  } catch (err) {
    console.error("Error fetching shipments:", err);
    res.status(500).json({ 
      message: "Server error while fetching shipments", 
      error: err.message 
    });
  }
});

app.put("/api/shipment/update/:id", async (req, res) => {
  try {
    const updated = await Shipment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.delete("/api/shipment/delete/:id", async (req, res) => {
  try {
    await Shipment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Shipment deleted" });
await Container.deleteMany({ shipment_ref: req.params.id });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// ✅ Start server only in local mode
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`✅ Server running locally at http://localhost:${PORT}`);
  });
}

export default app;
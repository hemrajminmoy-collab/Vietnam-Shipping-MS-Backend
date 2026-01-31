import express from "express";
import { createWarehouseRecord, getAllWarehouseRecords, deleteWarehouseRecord } from "../Controller/warehouse.controller.js";

const router = express.Router();

router.post("/", createWarehouseRecord);
router.get("/all", getAllWarehouseRecords);
router.delete("/:id", deleteWarehouseRecord);

export default router;

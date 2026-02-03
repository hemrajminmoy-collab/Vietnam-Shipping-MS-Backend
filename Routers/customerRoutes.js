import express from "express";
import { createCustomerRecord, getAllCustomerRecords, deleteCustomerRecord } from "../Controller/customer.controller.js";

const router = express.Router();

router.post("/", createCustomerRecord);
router.get("/all", getAllCustomerRecords);
router.delete("/:id", deleteCustomerRecord);

export default router;

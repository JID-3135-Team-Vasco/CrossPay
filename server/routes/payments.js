import express from "express";

const router = express.Router();

import { updatePayments, getPayments } from "../controllers/payments";

router.post("/update-payments", updatePayments);
router.get("/get-payments", getPayments);

export default router;

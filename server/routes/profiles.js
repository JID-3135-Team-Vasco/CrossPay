import express from "express";

const router = express.Router();

import {
  updatePaymentProfiles, getPaymentProfiles
} from "../controllers/profiles";

router.post("/update-payment-profiles", updatePaymentProfiles);
router.get("/get-payment-profiles", getPaymentProfiles);

export default router;
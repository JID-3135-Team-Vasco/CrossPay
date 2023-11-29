import express from "express";

const router = express.Router();

import {
  updatePaymentProfile,
  getPaymentProfiles,
  addPaymentProfile,
  deletePaymentProfile,
} from "../controllers/profiles";

router.post("/update-payment-profile", updatePaymentProfile);
router.post("/add-payment-profile", addPaymentProfile);
router.get("/get-payment-profiles", getPaymentProfiles);
router.post("/delete-payment-profile", deletePaymentProfile);

export default router;

import express from "express";

const router = express.Router();

import {
  updatePaymentProfiles, getPaymentProfiles, addPaymentProfile, deletePaymentProfile,
} from "../controllers/profiles";

router.post("/update-payment-profiles", updatePaymentProfiles);
router.post("/add-payment-profile", addPaymentProfile);
router.get("/get-payment-profiles", getPaymentProfiles);
router.delete("/delete-payment-profile", deletePaymentProfile);

export default router;
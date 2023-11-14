import express from "express";

const router = express.Router();

import {
  updateAccounts, getAccounts, sendAccountNotif
} from "../controllers/accounts";

router.post("/update-accounts", updateAccounts);
router.get("/get-accounts", getAccounts);
router.post("/send-account-notif", sendAccountNotif);

export default router;
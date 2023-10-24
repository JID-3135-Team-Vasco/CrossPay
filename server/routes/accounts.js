import express from "express";

const router = express.Router();

import {
  updateAccounts, getAccounts
} from "../controllers/accounts";

router.post("/update-accounts", updateAccounts);
router.get("/get-accounts", getAccounts);

export default router;
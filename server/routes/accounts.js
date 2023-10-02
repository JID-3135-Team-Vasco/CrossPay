import express from "express";

const router = express.Router();

import {
  addAccounts, getAccounts
} from "../controllers/accounts";

router.post("/add-accounts", addAccounts);
router.get("/get-accounts", getAccounts);

export default router;
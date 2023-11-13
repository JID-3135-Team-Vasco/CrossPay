import express from "express";

const router = express.Router();

import { updateTransfers, getTransfers } from "../controllers/transfers";

router.post("/update-transfers", updateTransfers);
router.get("/get-transfers", getTransfers);

export default router;

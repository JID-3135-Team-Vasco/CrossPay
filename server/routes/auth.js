import express from "express";

const router = express.Router();

import { signUp, signIn, forgotPassword, resetPassword } from "../controllers/auth";

router.get("/", (req, res) => {
  return res.json({
    data: "Hello from the API",
  });
});

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;

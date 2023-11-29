import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import session from "express-session";

import authRoutes from "./routes/auth";
import plaidRoutes from "./routes/plaid";
import accountRoutes from "./routes/accounts";
import transferRoutes from "./routes/transfers";
import paymentRoutes from "./routes/payments";
import profileRoutes from "./routes/profiles";

import morgan from "morgan";

const app = express();
dotenv.config();

mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB connection error: ", err));

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

app.use(
  // FOR DEMO PURPOSES ONLY
  // Use an actual secret key in production
  session({ secret: "bosco", saveUninitialized: true, resave: true })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/users", authRoutes);
app.use("/api", plaidRoutes);
app.use("/accounts", accountRoutes);
app.use("/transfers", transferRoutes);
app.use("/payments", paymentRoutes);
app.use("/payment-profiles", profileRoutes);

app.listen(8000, () => console.log("Server running on port 8000"));

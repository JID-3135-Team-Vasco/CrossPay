import dotenv from "dotenv";
import express from "express";
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import User from "../models/user";

const router = express.Router();
dotenv.config();

// Configuration for the Plaid client
const config = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      "PLAID-SECRET": process.env.PLAID_SECRET,
      "Plaid-Version": "2020-09-14",
    },
  },
});

//Instantiate the Plaid client with the configuration
const client = new PlaidApi(config);

//Creates a Link token and return it
router.post("/create_link_token", async (req, res, next) => {
  let payload = {};
  //Payload if running iOS
  if (req.body.address === "localhost") {
    payload = {
      user: { client_user_id: req.sessionID },
      client_name: "CrossPay",
      language: "en",
      products: ["auth"],
      country_codes: ["US"],
      link_customization_name: "payments",
      redirect_uri: process.env.PLAID_SANDBOX_REDIRECT_URI,
    };
  } else {
    //Payload if running Android
    payload = {
      user: { client_user_id: req.sessionID },
      client_name: "CrossPay",
      language: "en",
      link_customization_name: "payments",
      products: ["auth"],
      country_codes: ["US"],
      android_package_name: process.env.PLAID_ANDROID_PACKAGE_NAME,
    };
  }
  const tokenResponse = await client.linkTokenCreate(payload);
  res.json(tokenResponse.data);
});

// Exchanges the public token from Plaid Link for an access token
router.post("/exchange_public_token", async (req, res, next) => {
  const exchangeResponse = await client.itemPublicTokenExchange({
    public_token: req.body.public_token,
  });

  // FOR DEMO PURPOSES ONLY
  // Store access_token in DB instead of session storage
  req.session.access_token = exchangeResponse.data.access_token;
  console.log(req.session.access_token);
  const email = req.body.email;
  const user = await User.findOne({ email });
  // if user not found
  if (!user) {
    return res.json({ error: "Email or reset code is invalid" });
  }
  user.access_token = exchangeResponse.data.access_token;
  user.save();
  res.json(true);
});

// Fetches balance data using the Node client library for Plaid
router.post("/account-data", async (req, res, next) => {
  const access_token = req.session.access_token;
  const institution_id = req.body.institution_id;
  const balanceResponse = await client.accountsBalanceGet({
    access_token,
  });
  let accounts = balanceResponse.data.accounts;
  console.log(accounts);
  accounts[0]["access_token"] = access_token;
  accounts[0]["institution_id"] = institution_id;
  console.log(accounts);
  res.json({
    accounts: accounts,
  });
});

router.post("/balances", async (req, res, next) => {
  const access_token = req.body.access_token;
  const balanceResponse = await client.accountsBalanceGet({
    access_token,
  });
  let balances = balanceResponse.data.accounts[0].balances;
  res.json({
    balances: balances,
  });
});

// PAYMENT ROUTES

router.post("/payment/authorize", async (req, res, next) => {
  const account_number = req.body.account_number;
  const routing_number = req.body.routing_number;
  const account_type = req.body.account_type;
  let accountResponse = null;
  try {
    accountResponse = await client.transferMigrateAccount({
      account_number,
      routing_number,
      account_type,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      error: error.response.data.error_message,
    });
  }
  const { access_token, account_id } = accountResponse.data;
  return res.json({
    access_token: access_token,
    account_id: account_id,
  });
});

// TRANSFER ROUTES

router.post("/transfer/ledger", async (req, res, next) => {
  const access_token = req.body.access_token;
  const account_id = req.body.account_id;
  const amount = req.body.amount;
  const email = req.body.email;

  const user = await User.findOne({ email });
  // if user not found
  if (!user) {
    return res.json({ error: "Email or reset code is invalid" });
  }

  let transferAuthorizationCreatePayload = {
    access_token: access_token,
    account_id: account_id,
    type: "debit",
    network: "ach",
    amount: amount,
    ach_class: "ppd",
    user: {
      legal_name: user.name,
    },
  };
  let transferAuthorizationCreateResponse = null;
  try {
    transferAuthorizationCreateResponse =
      await client.transferAuthorizationCreate(
        transferAuthorizationCreatePayload
      );
  } catch (error) {
    return res.json({
      error: error.response.data.error_message,
    });
  }

  if (
    transferAuthorizationCreateResponse.data.authorization.decision ===
    "declined"
  ) {
    return res.json({
      error: transferAuthorizationCreateResponse.decision_rationale.description,
    });
  }
  const authorization_id =
    transferAuthorizationCreateResponse.data.authorization.id;

  let transferPayload = {
    access_token: access_token,
    account_id: account_id,
    authorization_id: authorization_id,
    description: "Ledger",
  };
  let transferResponse = null;
  try {
    transferResponse = await client.transferCreate(transferPayload);
  } catch (error) {
    return res.json({
      error: error.response.data.error_message,
    });
  }
  return res.json({
    transfer: transferResponse.data.transfer,
  });
});

router.post("/transfer/destination", async (req, res, next) => {
  const access_token = req.body.access_token;
  const account_id = req.body.account_id;
  const amount = req.body.amount;
  const email = req.body.email;

  const user = await User.findOne({ email });
  // if user not found
  if (!user) {
    return res.json({ error: "Email or reset code is invalid" });
  }

  let transferAuthorizationCreatePayload = {
    access_token: access_token,
    account_id: account_id,
    type: "credit",
    network: "ach",
    amount: amount,
    ach_class: "ppd",
    user: {
      legal_name: user.name,
    },
  };
  let transferAuthorizationCreateResponse = null;
  try {
    transferAuthorizationCreateResponse =
      await client.transferAuthorizationCreate(
        transferAuthorizationCreatePayload
      );
  } catch (error) {
    return res.json({
      error: error.response.data.error_message,
    });
  }

  console.log(transferAuthorizationCreateResponse);

  if (
    transferAuthorizationCreateResponse.data.authorization.decision ===
    "declined"
  ) {
    return res.json({
      error:
        transferAuthorizationCreateResponse.data.authorization
          .decision_rationale.description,
    });
  }
  const authorization_id =
    transferAuthorizationCreateResponse.data.authorization.id;

  let transferPayload = {
    access_token: access_token,
    account_id: account_id,
    authorization_id: authorization_id,
    description: "CrossPay",
  };
  let transferResponse = null;
  try {
    transferResponse = await client.transferCreate(transferPayload);
  } catch (error) {
    return res.json({
      error: error.response.data.error_message,
    });
  }
  return res.json({
    transfer: transferResponse.data.transfer,
  });
});

export default router;

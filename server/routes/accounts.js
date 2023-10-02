// import User from "../models/user";
// import express from "express";
// import { hashPassword } from "../helpers/auth";

// const router = express.Router();

// //For updating user in db
// router.put("/", async(req, res) => {
//     if (typeof req.body !== 'object') {
//         return res.json({
//             error: "Request failed",
//           });
//     }
//     const {name, email, password, accounts} = req.body;
//     let user;
//     try{
//         user = await User.findOne({email: email});
//         if (!user) {
//             return res.json({
//               error: "No user found",
//             });
//         }
//     } catch(err) {
//         console.log(err);
//     }
//     //If updating password
//     if (password) {
//         if (password.length < 6 || password.length > 20) {
//             return res.json({
//               error: "Password should be between 6 and 20 characters long",
//             });
//         }
//         password = await hashPassword(password);
//         user.password = password;
//     }
//     if (name) {
//         user.name = name;
//     }
//     if (accounts) {
//         user.accounts = accounts;
//     }
//     try {
//         user.save();
//     } catch (err) {
//         console.log(err);
//     }
// });

// export default router;

import express from "express";

const router = express.Router();

import {
  addAccounts, getAccounts
} from "../controllers/accounts";

router.post("/add-accounts", addAccounts);
router.get("/get-accounts", getAccounts);

export default router;
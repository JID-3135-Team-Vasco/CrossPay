import { IncomeBreakdownType } from "plaid";
import User from "../models/user";
import dotenv from "dotenv";
dotenv.config();

export const getTransfers = async (req, res) => {
  try {
    const { email } = req.query;
    console.log(email);
    // find user based on email and resetCode
    const user = await User.findOne({ email });
    // if user not found
    if (!user) {
      return res.json({ error: "Email or reset code is invalid" });
    }
    if (!user.transfers) {
      return res.json({ transfers: [] });
    }
    return res.json({ transfers: user.transfers });
  } catch (err) {
    console.log(err);
  }
};

export const updateTransfers = async (req, res) => {
  try {
    const { email, transfer } = req.body;
    console.log(email);
    // find user based on email and resetCode
    const user = await User.findOne({ email });
    // if user not found
    if (!user) {
      return res.json({ error: "Email or reset code is invalid" });
    }
    let userTransfers = [];
    if (user.transfers && user.transfers.length > 0) {
      userTransfers = user.transfers;
      userTransfers.push(transfer);
    } else {
      userTransfers.push(transfer);
    }
    user.transfers = userTransfers;
    user.save();

    //send email notif to recipient of transfer
    const sgMail = require("@sendgrid/mail");
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    console.log("Sending notif to email: ", email);

    let body = `
    <div style="font-family: inherit; text-align: inherit">
      <p>Dear ${user.name},</p>

      <p>Your transfer has successfully been initiated! Here are the details:</p>

      <ul>
        <li><strong>Source Account:</strong> ${transfer.source_account}</li>
        <li><strong>Amount:</strong> ${transfer.amount}</li>
        <li><strong>Destination Account:</strong> ${transfer.dest_account}</li>
      </ul>

      <p>Best Regards,<br>The CrossPay Team</p>
    </div>`;

    const msg = {
      to: email,
      from: "jasonjiang09@gmail.com",
      subject: "CrossPay Transfer Initiated!",
      html: body,
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });

    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};

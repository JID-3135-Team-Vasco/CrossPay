import User from "../models/user";
import dotenv from "dotenv";
dotenv.config();

export const getPayments = async (req, res) => {
  try {
    const { email } = req.query;
    console.log(email);
    // find user based on email and resetCode
    const user = await User.findOne({ email });
    // if user not found
    if (!user) {
      return res.json({ error: "Email or reset code is invalid" });
    }
    if (!user.payments) {
      return res.json({ payments: [] });
    }
    return res.json({ payments: user.payments });
  } catch (err) {
    console.log(err);
  }
};

export const updatePayments = async (req, res) => {
  try {
    const { email, payment } = req.body;
    console.log(email);
    // find user based on email and resetCode
    const user = await User.findOne({ email });
    // if user not found
    if (!user) {
      return res.json({ error: "Email or reset code is invalid" });
    }
    let userPayments = [];
    if (user.payments && user.payments.length > 0) {
      userPayments = user.payments;
      userPayments.push(payment);
    } else {
      userPayments.push(payment);
    }
    user.payments = userPayments;
    user.save();

    //send email notif to recipient of transfer
    const sgMail = require("@sendgrid/mail");
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    console.log("Sending notif to email: ", email);

    let body = `
    <div style="font-family: inherit; text-align: inherit">
      <p>Dear ${user.name},</p>

      <p>Your payment has successfully been initiated! Here are the details:</p>

      <ul>
        <li><strong>Source Account:</strong> ${payment.source_account}</li>
        <li><strong>Amount:</strong> ${payment.amount}</li>
        <li><strong>Destination Account Number:</strong> ${payment.dest_account_number}</li>
        <li><strong>Destination Routing Number:</strong> ${payment.dest_routing_number}</li>
      </ul>

      <p>Best Regards,<br>The CrossPay Team</p>
    </div>`;

    const msg = {
      to: email,
      from: "jasonjiang09@gmail.com",
      subject: "CrossPay Payment Initiated!",
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

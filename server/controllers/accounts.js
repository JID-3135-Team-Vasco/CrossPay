import User from "../models/user";
import dotenv from "dotenv";
dotenv.config();

export const getAccounts = async (req, res) => {
  try {
    const { email } = req.query;
    console.log(email);
    // find user based on email and resetCode
    const user = await User.findOne({ email });
    // if user not found
    if (!user) {
      return res.json({ error: "Email or reset code is invalid" });
    }
    if (!user.accounts) {
      return res.json({ accounts: [] });
    }
    return res.json({ accounts: user.accounts });
  } catch (err) {
    console.log(err);
  }
};

//Email notifications when accounts are added
export const sendAccountNotif = async (req, res) => {
  try {
    const sgMail = require("@sendgrid/mail");
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const { email, accounts } = req.body;
    console.log("Sending notif to email: ", email);
    console.log("Sending notif for following accounts: ", accounts);

    const msg = {
      to: email,
      from: "jasonjiang09@gmail.com",
      subject: "CrossPay Updated Account",
      text: "Congrats on registering a new bank account on CrossPay!",
      html: '<div style="font-family: inherit; text-align: inherit">Hello CrossPay User!</div><div style="font-family: inherit; text-align: inherit"><br></div><div style="font-family: inherit; text-align: inherit">You have registered a new Bank account on the app! Feel free to make a transfer or payment!</div><div style="font-family: inherit; text-align: inherit"><br></div><div style="font-family: inherit; text-align: inherit">Congrats!</div>',
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

export const updateAccounts = async (req, res) => {
  try {
    const { email, accounts } = req.body;
    console.log(email);
    // find user based on email and resetCode
    const user = await User.findOne({ email });
    // if user not found
    if (!user) {
      return res.json({ error: "Email or reset code is invalid" });
    }
    user.accounts = accounts;
    user.save();
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};

import User from "../models/user";

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
      return res.json({ accounts: [] });
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
    const sgMail = require('@sendgrid/mail')
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

    console.log("Sending notif to email: ", email);

    const msg = {
      to: email,
      from: 'jasonjiang09@gmail.com',
      subject: 'CrossPay Transfer Recieved!',
      text: 'Money Received!',
      html: '<div style="font-family: inherit; text-align: inherit">Money Received!</div>'
    }
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
      })
      .catch((error) => {
        console.error(error)
      })

    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};

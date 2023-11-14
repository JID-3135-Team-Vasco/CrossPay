import User from "../models/user";

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
export const sendAccountNotif = async(req, res) => {
  try {
    const sgMail = require('@sendgrid/mail')
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

    const { email, accounts } = req.body;
    console.log("Sending notif to email: ", email);
    console.log("Sending notif for following accounts: ", accounts)

    const msg = {
      to: email,
      from: 'jasonjiang09@gmail.com',
      subject: 'CrossPay Updated Account',
      html: '<strong>Hello there! Your bank account has been successfuly added!</strong>',
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
}

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

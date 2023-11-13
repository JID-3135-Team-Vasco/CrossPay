import User from "../models/user";

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
      return res.json({ accounts: [] });
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
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};

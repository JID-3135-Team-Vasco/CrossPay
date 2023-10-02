import User from "../models/user";

export const getAccounts = async (req, res) => {
  try {
    console.log("i am here");
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

export const addAccounts = async (req, res) => {
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

import User from "../models/user";

export const getPaymentProfiles = async (req, res) => {
  try {
    const { email } = req.query;
    console.log(email);
    // find user based on email and resetCode
    const user = await User.findOne({ email });
    // if user not found
    if (!user) {
      return res.json({ error: "Email or reset code is invalid" });
    }
    if (!user.payment_profiles) {
      return res.json({ payment_profiles: [] });
    }
    return res.json({ payment_profiles: user.payment_profiles });
  } catch (err) {
    console.log(err);
  }
};

export const addPaymentProfile = async (req, res) => {
  try {
    const {
      email,
      name,
      account_number,
      routing_number,
      type,
      access_token,
      account_id,
    } = req.body;
    console.log(email);
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ error: "Email or reset code is invalid" });
    }

    let newProfile = {
      name: name,
      account_number: account_number,
      routing_number: routing_number,
      type: type,
      access_token: access_token,
      account_id: account_id,
    };

    let profiles = user.payment_profiles;
    if (profiles) {
      profiles.push(newProfile);
      user.payment_profiles = profiles;
      user.save();
    } else {
      profiles = [];
      profiles.push(newProfile);
      user.payment_profiles = profiles;
      user.save();
    }
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};

export const updatePaymentProfile = async (req, res) => {
  try {
    const {
      email,
      name,
      account_number,
      routing_number,
      type,
      access_token,
      account_id,
      existing_id,
    } = req.body;
    console.log(email);
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ error: "Email or reset code is invalid" });
    }
    let targetProfile = {
      name: name,
      account_number: account_number,
      routing_number: routing_number,
      type: type,
      access_token: access_token,
      account_id: account_id,
    };

    let profiles = user.payment_profiles;
    if (profiles) {
      for (var i = 0; i < profiles.length; i++) {
        if (profiles[i]._id == existing_id) {
          profiles[i] = targetProfile;
          break;
        }
      }
      console.log(profiles);
      user.payment_profiles = profiles;
      user.save();
    } else {
      return res.json({ error: "Payment profiles not found" });
    }
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};

export const deletePaymentProfile = async (req, res) => {
  console.log("here");
  try {
    const { email, profile_id } = req.body;
    console.log(email);
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ error: "Email or reset code is invalid" });
    }

    let profiles = user.payment_profiles;
    if (profiles) {
      for (var i = 0; i < profiles.length; i++) {
        if (profiles[i]._id == profile_id) {
          profiles.splice(i, 1);
        }
      }
      user.payment_profiles = profiles;
      user.save();
    } else {
      return res.json({ error: "Payment profiles not found" });
    }
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};

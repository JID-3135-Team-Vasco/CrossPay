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
        const { email, access_token, account_id } = req.body;
        console.log(email);
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ error: "Email or reset code is invalid" });
        }
        newProfile = {
            access_token: access_token,
            account_id: account_id,
        }

        profiles = user.payment_profiles;
        if (profiles) {
            profiles.push(newProfile);
            user.payment_profiles = profiles;
            user.save();
        } else {
            profiles = [];
            profiles.push(newProfile);
            user.payment_profiles = profiles;
            user.save()
        }
        return res.json({ ok: true });
    } catch (err) {
        console.log(err);
    }
};

  export const updatePaymentProfiles = async (req, res) => {
    try {
      const { email, payment_profiles } = req.body;
      console.log(email);
      // find user based on email and resetCode
      const user = await User.findOne({ email });
      // if user not found
      if (!user) {
        return res.json({ error: "Email or reset code is invalid" });
      }
      user.payment_profiles = payment_profiles;
      user.save();
      return res.json({ ok: true });
    } catch (err) {
      console.log(err);
    }
  };

  export const deletePaymentProfile = async (req, res) => {
    try {
        const { email, access_token, account_id } = req.body;
        console.log(email);
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ error: "Email or reset code is invalid" });
        }
        targetProfile = {
            access_token: access_token,
            account_id: account_id,
        }

        profiles = user.payment_profiles;
        if (profiles) {
            for (var i = 0; i < profiles.length; i++){
                if (profiles[i].access_token == targetProfile.access_token 
                    && profiles[i].account_id == targetProfile.account_id) {
                        profiles.splice(i, 1);
                    }
            }
            user.payment_profiles = profiles;
            user.save();
        } else {
            return res.json({ error: "No payment profiles found." });
        }
        return res.json({ ok: true });
    } catch (err) {
        console.log(err);
    }
};
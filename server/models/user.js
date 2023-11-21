import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 20,
    },
    accounts: {
      type: Array,
      required: false,
    },
    transfers: {
      type: Array,
      required: false,
    },
    payments: {
      type: Array,
      required: false,
    },
    access_token: {
      type: String,
    },
    payment_profiles: {
      type: Array,
      required: false,
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);

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
    transfers: [
      {
        source_account: {
          type: String,
          required: true,
        },
        source_account_id: {
          type: String,
          required: true,
        },
        source_access_token: {
          type: String,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        time: {
          type: Date,
          required: true,
        },
        dest_account: {
          type: String,
          required: true,
        },
        dest_account_id: {
          type: String,
          required: true,
        },
        dest_access_token: {
          type: String,
          required: true,
        },
        ledger_transfer_id: {
          type: String,
          required: true,
        },
        destination_transfer_id: {
          type: String,
          required: true,
        },
      },
    ],
    payments: [
      {
        source_account: {
          type: String,
          required: true,
        },
        source_account_id: {
          type: String,
          required: true,
        },
        source_access_token: {
          type: String,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        time: {
          type: Date,
          required: true,
        },
        dest_account_number: {
          type: String,
          required: true,
        },
        dest_routing_number: {
          type: String,
          required: true,
        },
        dest_account_id: {
          type: String,
          required: true,
        },
        dest_access_token: {
          type: String,
          required: true,
        },
        ledger_transfer_id: {
          type: String,
          required: true,
        },
        destination_transfer_id: {
          type: String,
          required: true,
        },
      },
    ],
    access_token: {
      type: String,
    },
    payment_profiles: [
      {
        name: {
          type: String,
          required: true,
        },
        account_number: {
          type: String,
          required: true,
        },
        routing_number: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: ["checking", "savings"],
          required: true,
        },
        account_id: {
          type: String,
          required: true,
        },
        access_token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);

import mongoose from "mongoose";

const userShema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },

    resetToken: String,
    resetTokenExpiration: Date,
  },
  { timestamps: true },
);

export default mongoose.model("user", userShema);

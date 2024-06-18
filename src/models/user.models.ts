import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
  username: string;
  password?: string;
  email: string;
  isVerified: boolean;
  isSubscribed: boolean;
  verifyCode?: string;
  verifyCodeExpiry?: boolean;
  avatar?: string;
}

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      match: [/.+\@.+\..+/, "Please use a valid email address"],
      unique: true,
    },
    verifyCode: {
      type: String,
    },
    verifyCodeExpiry: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default: '/public/avatar.jpeg'
    }
  },
  {
    timestamps: true,
  }
);

const UserModel =
  mongoose.models.User || mongoose.model<User>("User", UserSchema);

export default UserModel;

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.models";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendVerificationEmail } from "@/utils/sendVerificationEmail";

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const {
      email,
      username,
      password,
    } = await request.json();

    if (!email && !username) {
      return NextResponse.json(
        { success: false, message: "identifiers required" },
        { status: 401 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { success: false, message: "password is required" },
        { status: 401 }
      );
    }

    const existingVerifiedUserByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUserByUsername) {
      return NextResponse.json({
        success: false,
        message: "Username is already taken",
      });
    }

    const existingUserByEmail = await UserModel.findOne({ email });

    let otp = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return NextResponse.json(
          {
            success: false,
            message: "User already exists with this email",
          },
          { status: 400 }
        );
      } else {
        existingUserByEmail.password = await bcryptjs.hash(password, 10);
        existingUserByEmail.verifyCode = otp;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcryptjs.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode: otp,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
      });

      await newUser.save();
    }

    const emailResponse = await sendVerificationEmail(email, username, otp);
    if (!emailResponse.success) {
      return NextResponse.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully. Please verify your account.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user: ", error);
    return NextResponse.json(
      {
        success: true,
        message: "Error registering user",
      },
      {
        status: 500,
      }
    );
  }
}

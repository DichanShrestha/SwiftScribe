import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { username, otp } = await request.json();
    const user = await UserModel.findOne({ username });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "user not found" },
        { status: 400 }
      );
    }
    const isDateExpired = new Date(user.verifyCodeExpiry) < new Date();
    console.log(user.verifyCode, otp);
    
    if (user.verifyCode === otp && !isDateExpired) {
      user.isVerified = true;
      user.verifyCode = undefined;
      user.verifyCodeExpiry = undefined;
      await user.save();

      return NextResponse.json(
        {
          success: true,
          message: "Account verified successfully",
        },
        { status: 200 }
      );
    } else if (isDateExpired) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Verification code has expired. Please sign up again to get a new code",
        },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Incorrect verification code",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error verifying user: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error verifying user",
      },
      { status: 500 }
    );
  }
}

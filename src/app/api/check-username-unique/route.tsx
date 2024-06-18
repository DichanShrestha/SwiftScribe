import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.models";
import { usernameValidation } from "@/schemas/signUpSchema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParam = { username: searchParams.get("username") };
    const result = UsernameQuerySchema.safeParse(queryParam);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return NextResponse.json(
        {
          success: false,
          message: usernameErrors.length > 0
            ? usernameErrors.join(", ")
            : "Invalid query parameters",
        },
        { status: 400 }
      );
    }
    
    const { username } = result.data;

    const user = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (user) {
      return NextResponse.json(
        { success: false, message: "Username is already taken" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Username is unique" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking username: ", error);
    return NextResponse.json(
      { success: false, message: "Error checking username" },
      { status: 500 }
    );
  }
}

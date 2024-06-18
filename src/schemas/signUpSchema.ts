import { z } from "zod";

export const usernameValidation = z.string()
.min(2, { message: "username should be atleast 2 letters" })
.max(15, { message: "username should be atmost 15 letters" })
.regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters")

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "password must be atleast 6 letters" }),
});

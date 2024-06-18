import dbConnect from "@/lib/dbConnect";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import UserModel from "@/models/user.models";
import bcryptjs from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";
import { signInSchema } from "@/schemas/signInSchema"; // Adjust the path accordingly

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Username/Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();

        if (!credentials) {
          throw new Error("Missing credentials");
        }

        // Validate credentials using signInSchema
        const parseResult = signInSchema.safeParse(credentials);
        if (!parseResult.success) {
          console.error("Validation error:", parseResult.error);
          throw new Error("Invalid credentials");
        }

        const { identifier, password } = parseResult.data;

        console.log('Credentials received:', { identifier });

        try {
          const user = await UserModel.findOne({
            $or: [
              { email: identifier },
              { username: identifier },
            ],
          });

          if (!user) {
            console.error("No user found with identifier:", identifier);
            throw new Error("No user found!");
          }

          if (!user.isVerified) {
            console.error("User is not verified:", identifier);
            throw new Error("Please verify your account");
          }

          const isPasswordCorrect = await bcryptjs.compare(password, user.password);

          if (!isPasswordCorrect) {
            console.error("Incorrect password for user:", identifier);
            throw new Error("Password is incorrect");
          }

          console.log("User authenticated successfully:", user.username);
          return user;
        } catch (error) {
          console.error("Error during authorization:", error);
          throw new Error("Authorization failed");
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],

  callbacks: {
    async signIn({ user, profile }) {
      try {
        await dbConnect();
        const existingUser = await UserModel.findOne({ email: profile?.email });

        if (!existingUser) {
          const newUser = new UserModel({
            username: profile?.name,
            email: profile?.email,
            isVerified: true,
          });
          await newUser.save();
          user._id = newUser._id;
          user.isVerified = newUser.isVerified;
          user.username = newUser.username;
        } else {
          user._id = existingUser._id;
          user.isVerified = existingUser.isVerified;
          user.username = existingUser.username;
        }
        return true;
      } catch (error) {
        console.error("Error during Google sign-in:", error);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id?.toString();
        session.user.isVerified = token.isVerified;
        session.user.username = token.username;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

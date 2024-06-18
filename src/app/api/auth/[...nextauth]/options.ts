import dbConnect from "@/lib/dbConnect";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import UserModel from "@/models/user.models";
import bcryptjs from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Username/Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        console.log('running -, 19');
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.password },
            ],
          });

          if (!user) {
            throw new Error("No user found!");
          }
          if (!user.isVerified) {
            throw new Error("Please verify your account");
          }
          
          const isPasswordCorrect = await bcryptjs.compare(
            credentials.password,
            user.password
          );
          
          if (!isPasswordCorrect) {
            throw new Error("password is incorrect");
          }
          return user;
        } catch (error) {
          console.error(error);
          return null;
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
    async signIn({account, user, profile }) {
      console.log('running, 63');
      if(account?.provider === "google"){
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
          console.error("Error while signing in from Google:", error);
          return false;
        }
      }else if(account?.provider === "credentials"){
        return true;
      }
      return false;
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

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb";
import dbConnect from "../../../lib/dbConnect"
import User from "../../../model/User";
import { compare } from "bcrypt";

export default NextAuth({
    providers: [
        // Email & Password
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "text",
                },
                password: {
                    label: "Password",
                    type: "password",
                },
            },
            async authorize(credentials) {
                await dbConnect();
    
                const user = await User.findOne({
                    email: credentials?.email,
                });
    
                if (!user) {
                    throw new Error("Email is not registered");
                }
    
                const isPasswordCorrect = await compare(
                    credentials!.password,
                    user.hashedPassword
                );
    
                if (!isPasswordCorrect) {
                    throw new Error("Password is incorrect");
                }

                return user;
            },
        })
    ],
    callbacks: {
        async session({ session, token, user }: any) {
            if(user) {
                session.user.role = user.role;
            } else {
                await dbConnect();
                const foundUser = await User.findOne({ email: session.user.email }); 
                session.user.role = foundUser.role;
                session.user.userId = foundUser.userId;
            }
            return session;
        },
      // async jwt( { token, user, account, profile, isNewUser}: any ) {
      //   console.log({ token, user, account, profile, isNewUser});
      //   if(user) {
      //     token.role = user.role;
      //   }
      //   return token;
      // }
    },
    // pages: {
    //   signIn: "/auth",
    // },
    debug: process.env.NODE_ENV === "development",
    adapter: MongoDBAdapter(clientPromise),
    session: {
        strategy: "jwt",
    },
    jwt: {
        secret: process.env.NEXTAUTH_JWT_SECRET,
    },
    secret: process.env.NEXTAUTH_SECRET,
  });
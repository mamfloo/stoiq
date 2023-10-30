import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { NextAuthOptions, getServerSession } from "next-auth";
import clientPromise from "./mongo/mongodb";
import Account from "@/models/Account";
import { compare } from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google"
import { getErrorMessage } from "./errorToString";


export const authOptions: NextAuthOptions = {
    adapter: MongoDBAdapter(clientPromise),
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/"
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
        }),
        CredentialsProvider({
        // The name to display on the sign in form (e.g. "Sign in with...")
        name: "Credentials",
        // `credentials` is used to generate a form on the sign in page.
        // You can specify which fields should be submitted, by adding keys to the `credentials` object.
        // e.g. domain, username, password, 2FA token, etc.
        // You can pass any HTML attribute to the <input> tag through the object.
        credentials: {
          username: { label: "Username", type: "text", placeholder: "jsmith" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
          if(!credentials?.username || !credentials?.password){
              return null;
          }
          const existingUser = await Account.findOne({username: credentials?.username})
          if(!existingUser) {
              return null;
          }
          const passwordMatch = await compare(credentials?.password!, existingUser.password)
          if(!passwordMatch){
              return null;
          }
          return {
              id: existingUser._id,
              username: existingUser.username,
              email: existingUser.email,
              profilePic: existingUser.profilePic,
              bio: existingUser.bio,
              registerDate: existingUser.registerDate.toLocaleDateString(),
              page: existingUser.page
          }
      }
  })
  ],
  callbacks: {
    async jwt({token, user, trigger}){
        if(trigger === "update"){
            const session = await getServerSession(authOptions);
            const account = await Account.findOne({email: session?.user.email})
            token.username = account.username;
            token.bio = account.bio;
            token.profilePic = account.profilePic;
            token.page = account.page;
        }
        if(user){
            return {
                ...token,
                username: user.username,
                profilePic: user.profilePic,
                bio: user.bio,
                id: user.id,
                registerDate: user.registerDate,
                page: user.page
            }
        }
        return token;
    },
    async session({session, token}){
        return {
            ...session,
            user: {
                ...session.user,
                username: token.username,
                profilePic: token.profilePic,
                bio: token.bio,
                id: token.id,
                registerDate: token.registerDate,
                page: token.page
            }
        }
    },
    async signIn({profile}) {
        console.log(profile);
        try {
            const res = await Account.findOne({email: profile?.email})
            if(!res && profile){
                const newUser = await Account.create({
                    username: profile.name + "" + profile.image?.slice(45),
                    email: profile.email,
                    profilePic: "default.png",
                    isActivated: true,
                    registerDate: Date.now(),
                    bio: "something funny",
                });
            }
        } catch(e){
            throw Error(getErrorMessage(e));
        }
        return true;
    }
  }
}


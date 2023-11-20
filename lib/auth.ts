import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { NextAuthOptions, getServerSession } from "next-auth";
import clientPromise from "./mongo/mongodb";
import { compare } from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google"
import { getErrorMessage } from "./errorToString";
import Users from "@/models/Users";


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
          const existingUser = await Users.findOne({username: credentials?.username})
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
          }
      }
  })
  ],
  callbacks: {
    async jwt({token, user, trigger, account, profile}){
        let userFromDb;
        //adding the username, profilepic, isActivated, registerdate, bio to the google account that was just added
        if(account?.provider === "google"){
            try { 
                userFromDb = await Users.findOne({email: profile?.email});
                if(userFromDb && trigger === "signUp"){
                    userFromDb = await Users.findOneAndUpdate({email: profile?.email},{
                        username: Math.random().toString(36).substring(2,15).toString(),
                        profilePic: "default.png",
                        isActivated: true,
                        registerDate: Date.now(),
                        bio: "something funny",
                        quotePage: 0
                    });
                }
                userFromDb = await Users.findOne({email: profile?.email});
            } catch(e){
                console.log(getErrorMessage(e));
            }
        }
        if(trigger === "update"){
            const session = await getServerSession(authOptions);
            const account = await Users.findOne({email: session?.user.email})
            token.username = account.username;
            token.bio = account.bio;
            token.profilePic = account.profilePic;
        }
        //settings the return if user.username, profilepic... are undefined then it means it it the first time the user is login with google so i pass the data from the db
        // because the use data is undefined the first time singning in with google...

        if(user){
            return {
                ...token,
                username: user.username || userFromDb.username,
                profilePic: user.profilePic || userFromDb.profilePic,
                bio: user.bio || userFromDb.bio,
                id: user.id,
                registerDate: user.registerDate || userFromDb.registerDate,
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
            }
        }
    },
    /* async signIn({user, account, profile}) {
        console.log(profile);
        if(account?.provider === "google"){
            console.log("google true")
            try { 
                const res = await Users.findOne({email: profile?.email});
                console.log(res)
                if(!res){
                    console.log("done");
                    const newUser = await Users.create({
                        username: profile?.name + "" + profile?.image?.slice(45),
                        email: profile?.email,
                        profilePic: "default.png",
                        isActivated: true,
                        registerDate: Date.now(),
                        bio: "something funny",
                    });
                    console.log(newUser);
                }
                return true;
            } catch(e){
                console.log(getErrorMessage(e));
                return false;
            }
        }
        return true;
    } */
  }
}


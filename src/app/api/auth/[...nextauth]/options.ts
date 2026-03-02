import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcrypt";
import userModal from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "text" },
        password: { label: "Password", type: "text" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await userModal.findOne({
            $or : [
                {
                    email: credentials.identifier         
                },
                {
                    username : credentials.identifier
                }
            ]
           });

          if (!user) {
            throw new Error('No user found with this email');
          }

          const isPasswordCorrect = await bcrypt.compare(credentials.password , user.password);

          if(!isPasswordCorrect) {
            throw new Error('Password is wrong');
          }else {
            return user ;
          }
        } catch (err : any) {
            throw new Error(err)
        }
      },
    }),
  ],
  callbacks: {
     async signIn({ user, account }) {
      if (account?.provider !== "google") return true;
      if (!user.email) return false;

      await dbConnect();

      const existingUser = await userModal.findOne({ email: user.email });

      if (existingUser) {
        if (user.image && !existingUser.profilePhoto) {
          existingUser.profilePhoto = user.image;
        }
        if (!existingUser.isVerified) {
          existingUser.isVerified = true;
        }
        await existingUser.save();
        return true;
      }

      const baseName = (user.name || user.email.split("@")[0] || "user")
        .replace(/[^a-zA-Z0-9]/g, "")
        .toLowerCase()
        .slice(0, 12) || "user";

      let generatedUsername = `${baseName}${Math.floor(100 + Math.random() * 900)}`;
      let usernameExists = await userModal.findOne({ username: generatedUsername });

      while (usernameExists) {
        generatedUsername = `${baseName}${Math.floor(100 + Math.random() * 900)}`;
        usernameExists = await userModal.findOne({ username: generatedUsername });
      }

      const randomPassword = `${Math.random().toString(36)}${Date.now().toString(36)}`;
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      await userModal.create({
        username: generatedUsername,
        email: user.email,
        password: hashedPassword,
        verifyCode: "GOOGLE_AUTH",
        verifyCodeExpire: new Date(),
        isAcceptingMessage: true,
        message: [],
        isVerified: true,
        profession: "",
        description: "",
        currentCompany: "",
        gender: "",
        age: null,
        profilePhoto: user.image || "",
      });

      return true;
     },
     async jwt({token , user, trigger, session}) {
       if (user?.email) {
         await dbConnect();
         const dbUser = await userModal.findOne({ email: user.email });
         if (dbUser) {
          token._id = dbUser._id?.toString();
          token.isVerified = !!dbUser.isVerified;
          token.isAcceptingMessage = !!dbUser.isAcceptingMessage;
          token.username = dbUser.username;
          token.profession = dbUser.profession;
          token.description = dbUser.description;
          token.currentCompany = dbUser.currentCompany;
          token.gender = dbUser.gender;
          token.age = dbUser.age;
          token.profilePhoto = dbUser.profilePhoto;
         }
       }

       if(user){
         token._id = user._id?.toString() || token._id;
         token.isVerified = user.isVerified ?? token.isVerified;
         token.isAcceptingMessage = user.isAcceptingMessage ?? token.isAcceptingMessage;
         token.username = user.username || token.username;
         token.profession = user.profession ?? token.profession;
         token.description = user.description ?? token.description;
         token.currentCompany = user.currentCompany ?? token.currentCompany;
         token.gender = user.gender ?? token.gender;
         token.age = user.age ?? token.age;
         token.profilePhoto = user.profilePhoto || token.profilePhoto;
       }

       if (trigger === "update" && session) {
        token.profession = session.profession;
        token.description = session.description;
        token.currentCompany = session.currentCompany;
        token.gender = session.gender;
        token.age = session.age;
        token.profilePhoto = session.profilePhoto;
       }
      return token 
     },
     async session({session , token}) {
        if(token) { 
            session.user._id = token._id?.toString();
            session.user.isVerified = token.isVerified;
            session.user.isAcceptingMessage = token.isAcceptingMessage;
            session.user.username = token.username;
            session.user.profession = token.profession;
            session.user.description = token.description;
            session.user.currentCompany = token.currentCompany;
            session.user.gender = token.gender;
            session.user.age = token.age;
            session.user.profilePhoto = token.profilePhoto;
       }
       return session
     },
  },
  pages : {
    signIn : '/sign-in'
  },
  session : {
    strategy : 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.NEXTAUTH_SECRETKEY
};

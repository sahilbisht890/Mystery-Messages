import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcrypt";
import userModal from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
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
     async jwt({token , user}) {
       if(user){
         token._id = user._id?.toString();
         token.isVerified = user.isVerified;
         token.isAcceptingMessage = user.isAcceptingMessage;
         token.username = user.username
       }
      return token 
     },
     async session({session , token}) {
        if(token) { 
            session.user._id = token._id?.toString();
            session.user.isVerified = token.isVerified;
            session.user.isAcceptingMessage = token.isAcceptingMessage;
            session.user.username = token.username;
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
  secret : process.env.NEXTAUTH_SECRETKEY
};

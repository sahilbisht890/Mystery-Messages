import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface User {
        _id?: string ,
        isVerified? : boolean ,
        email? : string ,
        username? : string,
        password? : string,
        isAcceptingMessage? : boolean
    }

    interface Session{
          user : {
            _id?: string ,
            isVerified? : boolean ,
            email? : string ,
            username? : string,
            password? : string,
            isAcceptingMessage? : boolean
          } & DefaultSession['user']
    }  
}

declare module 'next-auth/jwt' {
    interface JWT {
        _id?: string ,
        isVerified? : boolean ,
        email? : string ,
        username? : string,
        password? : string,
        isAcceptingMessage? : boolean
    }
}
import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface User {
        _id?: string ,
        isVerified? : boolean ,
        email? : string ,
        username? : string,
        password? : string,
        isAcceptingMessage? : boolean,
        profession?: string,
        description?: string,
        currentCompany?: string,
        gender?: string,
        age?: number,
        profilePhoto?: string
    }

    interface Session{
          user : {
            _id?: string ,
            isVerified? : boolean ,
            email? : string ,
            username? : string,
            password? : string,
            isAcceptingMessage? : boolean,
            profession?: string,
            description?: string,
            currentCompany?: string,
            gender?: string,
            age?: number,
            profilePhoto?: string
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
        isAcceptingMessage? : boolean,
        profession?: string,
        description?: string,
        currentCompany?: string,
        gender?: string,
        age?: number,
        profilePhoto?: string
    }
}

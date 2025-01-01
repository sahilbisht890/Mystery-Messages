import { getServerSession } from "next-auth";
import {authOptions} from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import userModal from "@/models/User";
import {User} from 'next-auth';
import mongoose from "mongoose";

export async function POST(request : Request) {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        const user : User = session?.user as User;
        if(!session || !session.user){
            return Response.json(
                { success: false, message: "User not found" },
                { status: 401 }
            )
        }
        const userID = user._id ;
        const {acceptMessages} = await request.json();
        const updatedUser = await userModal.findByIdAndUpdate(userID , {isAcceptingMessage : acceptMessages} , {new : true}); 
        if(!updatedUser){
            return Response.json({
               success : false , message : 'Failed to update the user'
            } , {
              status : 401
        })
        }       

        return Response.json({success : true , user : updatedUser , message : 'User updated Sucessfully'} , {status : 200}) 
    } catch (error) {
        
    }    
}

export async function GET(request : Request) {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        const user : User = session?.user as User;
        if(!user){
            return Response.json(
                { success: false, message: "User not found" },
                { status: 401 }
            )
        }
        const userID = new mongoose.Types.ObjectId(user._id) ;
        const foundedUser = await userModal.findById(userID);

        if(!foundedUser){
            return Response.json({
               success : false , message : 'Failed to update the user'
            } , {
              status : 401
        })
        }       

        return Response.json({success : true , isAcceptingMessages : foundedUser.isAcceptingMessage , message : 'Status Fetched Successfully'} , {status : 200}) 
    } catch (error) {
        return Response.json(
            { success: false, message: "Server Error" },
            { status: 500 }
        )
    }    
}
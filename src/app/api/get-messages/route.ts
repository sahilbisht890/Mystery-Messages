import { getServerSession } from "next-auth";
import {authOptions} from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import userModal from "@/models/User";
import {User} from 'next-auth';
import mongoose from "mongoose";

export async function GET(request : Request) {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        const user : User = session?.user as User;
        if(!session || !session.user){
            return Response.json(
                { success: false, message: "Not Authenticated" },
                { status: 401 }
            )
        }
        const userID = new mongoose.Types.ObjectId(user._id);
        const searchUser = await userModal.aggregate([
            {$match : {
                 id : userID
            }} ,
            {
                $unwind : "$message"
            } , 
            {
                $sort : {
                    'message.createdAt' : -1
                }
            } ,{
                $group : {
                    _id : "$_id",
                    messages : {
                        $push : "$messages"
                    }

                }
            }
        ])

        if(!searchUser || searchUser.length === 0)  {
            return Response.json({
                success : false ,
                message : "User not found"
            } , {
                status : 401
            })
        }

        return Response.json({success : true , messages : searchUser[0].messages } , {status : 200}) 
    } catch (error) {
        console.log('Error while getting the messages' , error);
        return Response.json({
            success : false ,
            message : 'Server Error'
        } , {
            status : 500
        })
    }    
}
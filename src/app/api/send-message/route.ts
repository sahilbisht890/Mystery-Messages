import dbConnect from "@/lib/dbConnect";
import userModal from "@/models/User";
import { Message } from "@/models/User";

export async function POST(request : Request) {
    await dbConnect();
    try {
        const {username , content} =  await request.json();
        const user = await userModal.findOne({
            username : username,
            isVerified : true
        })

        if(!user)  {
            return Response.json({
                success : false ,
                message : "User not found"
            } , {
                status : 401
            })
        }

        if(!user.isAcceptingMessage){
            return Response.json({
                success : false ,
                message : "User not accepting message"
            } , {
                status : 401
            })
        }

        const messageContent = {
            content  , createdAt : new Date()
        }

        await user.message.push(messageContent as Message);
        await user.save();

        return Response.json({success : true , messages : 'message sent successfully' } , {status : 200}) 
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
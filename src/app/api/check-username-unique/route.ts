import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import userModal from "@/models/User";
import { usernameValidation } from "@/schemas/signUpSchema";

const usernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();
  try {
        const {searchParams}  =  new URL(request.url)
        const  queryParam = {
            username : searchParams.get('username')
        }

        const result = usernameQuerySchema.safeParse(queryParam);
        console.log('zod safeParse output' , result);
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success : false ,
                message : usernameErrors?.length > 0 ? usernameErrors.join(',') : 
                'Inalid username'
            } , {
                status : 400
            })
        }
        
        const isUserVerifiedByUsername = await userModal.findOne({
            username : queryParam.username,
            isVerified : true
        })
        if(isUserVerifiedByUsername){
            return Response.json({
                success : false ,
                message : 'User is already verified with this username'
            } ,{
                status : 400
            })
        }
        return Response.json({
            success : true ,
            message : 'Username is unique'
        } ,{
            status : 200
        }
    );

  } catch (error) {
    console.log('Error checking while username' , error);
    return Response.json({
        success : false ,
        message : 'Error while checking username'
    } ,{
        status:500
    })
  }
}

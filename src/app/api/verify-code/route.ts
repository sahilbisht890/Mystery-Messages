import userModal from "@/models/User";
import dbConnect from "@/lib/dbConnect";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { email, verifyCode } = await request.json();
    const user = await userModal.findOne({ email });
    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 400 }
      );
    } else {
      if (new Date(user.verifyCodeExpire) < new Date()) {
        return Response.json(
          { success: false, message: "Verify Code is  Expired" },
          { status: 400 }
        );
      } else if (user.verifyCode !== verifyCode) {
        return Response.json(
          { success: false, message: "Verify Code is Wrong" },
          { status: 400 }
        ); 
      }
    }

   user.isVerified = true ;
   await user.save();

    return Response.json(
      { success: true, message: "Account Verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log('Error while verifying Code' , error);
    return Response.json({
        sucess : false ,
        message  : 'Server error while verifying code'
    } , {status : 500})
  }
}

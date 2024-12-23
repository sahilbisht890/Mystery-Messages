import dbConnect from "@/lib/dbConnect";
import sendEmail from "@/lib/resend";
import bcrypt from "bcrypt";
import { message, userModal } from "@/models/User";
import { SuiteContext } from "node:test";

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await req.json();

    const isUserVerifiedByUsername = await userModal.findOne({
      username,
      isVerified: true,
    });

    if (isUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "User is already verified",
        },
        {
          status: 400,
        }
      );
    }

    const isUserEmailExits = await userModal.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (isUserEmailExits) {
      if (isUserEmailExits.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exits with this email",
          },
          { status: 400 }
        );
      }
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 2);
      const new_user = await userModal.create({
        username,
        email,
        password: hashPassword,
        verifyCode: verifyCode,
        verifyCodeExpire: expiryDate,
        isAcceptingMessage: true,
        message: [],
        isVerified: false,
      });

      await new_user.save();

      const emailResponse = await sendEmail(email, username, verifyCode);

      if (!emailResponse.success) {
        return Response.json(
          {
            success: false,
            message: "Failed to send verification code",
          },
          {
            status: 500,
          }
        );
      }

      return Response.json(
        {
          success: true,
          message: "Verification code sent successfully",
        },
        {
          status: 200,
        }
      );
    }
  } catch (error) {
    console.log("Error registering user", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      {
        status: 500,
      }
    );
  }
}

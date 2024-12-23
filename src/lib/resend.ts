import { Resend } from 'resend';
import apiResponse from '@/types/apiResponses';

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail(email : string , username : string , verifyCode : string) : Promise<apiResponse>{

    try {
       await  resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Verification Code || Mystery Website',
            html: `
                <p>Hi ${username},</p>
                <p>Welcome to our Mystery Website! We're excited to have you on board.</p>
                <p>Your verification code is: <strong>${verifyCode}</strong></p>
                <p>Use this code to complete your registration and start exploring our platform.</p>
                <p>Thank you for joining us!</p>
                <p>Best regards,<br>The Mystery Website Team</p>
            `
          });

          return {success : true , message : 'message sent successfully'}
    } catch (error) {
       console.log('failed to send the email' , error)   
       return {success : true , message : 'message failed'};
    }
} 


export default  sendEmail ;


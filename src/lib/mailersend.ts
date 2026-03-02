import apiResponse from "@/types/apiResponses";

const MAILERSEND_API_URL = "https://api.mailersend.com/v1/email";

async function sendEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<apiResponse> {
  const apiKey = process.env.MAILERSEND_API_KEY;
  const fromEmail = process.env.MAILERSEND_FROM_EMAIL;
  const fromName = process.env.MAILERSEND_FROM_NAME || "Mystery Message";

  if (!apiKey || !fromEmail) {
    return {
      success: false,
      message: "MailerSend environment variables are missing",
    };
  }

  try {
    const html = `
      <p>Hi ${username},</p>
      <p>Welcome to our Mystery Website! We're excited to have you on board.</p>
      <p>Your verification code is: <strong>${verifyCode}</strong></p>
      <p>Use this code to complete your registration and start exploring our platform.</p>
      <p>Thank you for joining us!</p>
      <p>Best regards,<br>The Mystery Website Team</p>
    `;

    const response = await fetch(MAILERSEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: {
          email: fromEmail,
          name: fromName,
        },
        to: [{ email }],
        subject: "Verification Code || Mystery Website",
        html,
        text: `Hi ${username}, your verification code is ${verifyCode}.`,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        message: `MailerSend error: ${errorText || response.statusText}`,
      };
    }

    return { success: true, message: "Message sent successfully" };
  } catch (error) {
    console.log("Failed to send email via MailerSend", error);
    return { success: false, message: "Failed to send email" };
  }
}

export default sendEmail;

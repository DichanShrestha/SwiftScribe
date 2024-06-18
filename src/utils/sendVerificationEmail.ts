import sgMail from "@sendgrid/mail";
import { ApiResponse } from "@/types/ApiResponse";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const sendVerificationEmail = async (
  email: string,
  username: string,
  otp: string
): Promise<ApiResponse> => {
  try {
    const msg = {
      to: email,
      from: "dichanshrestha10@gmail.com",
      subject: "Input your verification code",
      html: `<!DOCTYPE html>
      <html lang="en" dir="ltr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verification Code</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap');
            body {
              font-family: 'Roboto', Verdana, sans-serif;
            }
            .heading {
              font-size: 24px;
              font-weight: normal;
            }
            .text {
              margin-bottom: 20px;
            }
          </style>
        </head>
        <body>
          <div class="preview">Here's your verification code: ${otp}</div>
          <div class="section">
            <div class="row">
              <h2 class="heading">Hello ${username},</h2>
            </div>
            <div class="row">
              <p class="text">
                Thank you for registering. Please use the following verification
                code to complete your registration:
              </p>
            </div>
            <div class="row">
              <p class="text">${otp}</p>
            </div>
            <div class="row">
              <p class="text">
                If you did not request this code, please ignore this email.
              </p>
            </div>
          </div>
        </body>
      </html>
      `,
    };
    await sgMail.send(msg);
    return { success: true, message: "Success sending verfication email" };
  } catch (error) {
    console.error("error sending verification email");
    return { success: false, message: "Failed sending verfication email" };
  }
};

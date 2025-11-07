import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import User from "@/models/usermodel";
import bcryptjs from "bcryptjs";
import { connectToDB } from "@/dbconfig/dbconfig";
connectToDB();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sendEmail = async ({email,emailType,userId}:any)=>{
try {
    //Created hashed token
    const hashedUserId = await bcryptjs.hash(userId.toString(),10);



    if (emailType === "VERIFY") {
        await User.findByIdAndUpdate(userId,{verifyToken:hashedUserId,verifyTokenExpiry:Date.now()+(60*60*1000)},{new:true});
    } else if (emailType === "RESET") {
        await User.findByIdAndUpdate(userId,{forgotPasswordToken:hashedUserId,forgotPasswordTokenExpiry:Date.now()+(60*60*1000)},{new:true});
    }
    


    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT ? parseInt(process.env.MAIL_PORT, 10) : undefined,
        secure: process.env.MAIL_SECURE === "true",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    } as nodemailer.TransportOptions);
    
    const mailOptions = {
        from : process.env.MAIL_FROM,
        to : email,
        subject : emailType === "VERIFY" ? "Verify your email" : "Reset your password",
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333;">${emailType === "VERIFY" ? "Verify Your Email" : "Reset Your Password"}</h2>
            <p style="color: #666; line-height: 1.6;">
                Click the button below to ${emailType === "VERIFY" ? "verify your email address" : "reset your password"}:
            </p>
            <a href="${process.env.DOMAIN}/verifyemail?token=${hashedUserId}" 
               style="display: inline-block; padding: 12px 24px; margin: 20px 0; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px;">
                ${emailType === "VERIFY" ? "Verify Email" : "Reset Password"}
            </a>
            <p style="color: #666; font-size: 14px;">
                Or copy and paste this link in your browser:
            </p>
            <p style="color: #0070f3; word-break: break-all; font-size: 14px;">
                ${process.env.DOMAIN}/verifyemail?token=${hashedUserId}
            </p>
            <p style="color: #999; font-size: 12px; margin-top: 30px;">
                If you didn't request this, please ignore this email.
            </p>
        </div>
        `
    }

    const mailResponse = await transporter.sendMail(mailOptions);
    return mailResponse;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
} catch (error:any)
{
    throw new Error(error.message);
    
}
}


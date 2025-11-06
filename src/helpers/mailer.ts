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
        port: process.env.MAIL_PORT,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });
    
    const mailOptions = {
        from : process.env.MAIL_FROM,
        to : email,
        subject : emailType === "VERIFY" ? "Verify your email" : "Reset your password",
        html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedUserId}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
        or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedUserId}
        </p>`
    }

    const mailResponse = await transporter.sendMail(mailOptions);
    return mailResponse;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
} catch (error:any)
{
    throw new Error(error.message);
    
}
}


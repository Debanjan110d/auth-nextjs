import { NextRequest,NextResponse } from "next/server";
import User from "@/models/usermodel";
import {connectToDB} from "@/dbconfig/dbconfig";

connectToDB();

export async function POST(request: NextRequest) {
    try {
        const reqbody = await request.json();
        const {token} = reqbody;

        //! FIXED: Added validation to check if token exists before querying
        if (!token) {
            return NextResponse.json({error: "Token is required"},{status: 400});
        }

        //! FIXED: Changed VerifyTokenExpiry to verifyTokenExpiry (lowercase 'v') to match mailer.ts
        const user = await User.findOne({verifyToken: token, verifyTokenExpiry: {$gt: Date.now()}});

        if (!user) {
            return NextResponse.json({error: "Invalid or expired token"},{status: 400});
        }

        //? Update user verification status and clear tokens
        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;

        await user.save();

        //! FIXED: Typo 'sucess' to 'success'
        return NextResponse.json({message: "Email verified successfully", success: true},{status: 200});

        
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
        return NextResponse.json({error: error.message},{status: 500})
    }
}

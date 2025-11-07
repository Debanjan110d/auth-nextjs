import { NextRequest,NextResponse } from "next/server";
import User from "@/models/usermodel";
import {connectToDB} from "@/dbconfig/dbconfig";

connectToDB();

export async function POST(request: NextRequest) {
    try {
        const reqbody = await request.json();
        const {token} = reqbody;

        const user = await User.findOne({verifyToken: token,VerifyTokenExpiry: {$gt: Date.now()}});

        if (!user) {
            return NextResponse.json({error: "Invalid or expired token"},{status: 400});
        }
        console.log(user);

        user.isVerified = true;
        user.verifyToken = undefined;
        user.VerifyTokenExpiry = undefined;

        await user.save();

        return NextResponse.json({message: "Email verified successfully",sucess: true},{status: 200});


        
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
        return NextResponse.json({error: error.message},{status: 500})
    }
}

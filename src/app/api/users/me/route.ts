import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest ,NextResponse } from "next/server";
import User from "@/models/usermodel";
import { connectToDB } from "@/dbconfig/dbconfig";

connectToDB();

export async function GET(request: NextRequest) {
    try {
        const userId = await getDataFromToken(request);
        //? If you do not want something then use -
        const user = await User.findOne({ _id: userId }).select("-password");     
        return NextResponse.json({ 
            message: "User found",
            data: user 
        }, { status: 200 });
        
            
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error :any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
        
    }
}






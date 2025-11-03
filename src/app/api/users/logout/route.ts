import { NextResponse } from "next/server";

export async function GET() {
try {

    const response = NextResponse.json({message: "Logout successful",sucess: true},{status: 200})

    response.cookies.set("token", "", {httpOnly: true,expires: new Date(0)})
    return response //? Do not Forget to return response


// eslint-disable-next-line @typescript-eslint/no-explicit-any
} catch (error:any) {
    return NextResponse.json({error: error.message},{status: 500})
}
}
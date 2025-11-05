import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function getDataFromToken(request: NextRequest) {

    try {
        const encodedToken = request.cookies.get("token")?.value || "";

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decodedToken : any = jwt.verify(encodedToken, process.env.TOKEN_SECRET!);
        return decodedToken.id;
        
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    } catch (error : any) {
        throw new Error("Invalid token");
    }

}

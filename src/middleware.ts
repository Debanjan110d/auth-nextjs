import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


//? This function can be marked " async" if using `await` inside
export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname; //? /, /profile, /login, /signup

    const isPublicPath = path === "/login" || path === "/signup"; //? /login, /signup

    const token = request.cookies.get("token")?.value || "";

    if (isPublicPath && token) {
        return NextResponse.redirect(new URL("/", request.nextUrl));// It should be always "nextUrl"
    }

}

//? See "Matching paths" below to learn more
export const config = {
    matcher: [
        "/",
        "/profile",
        "/login",
        "/signup"

    ],
};
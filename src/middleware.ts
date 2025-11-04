import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


//? This function can be marked "async" if using `await` inside
export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname; //? Current path: /, /profile, /profile/:id, /login, /signup

    //? Define public paths that don't require authentication
    const isPublicPath = path === "/login" || path === "/signup";

    //? Get the authentication token from cookies
    const token = request.cookies.get("token")?.value || "";

    //? If user is logged in (has token) and tries to access login/signup pages
    //? Redirect them to home page
    if (isPublicPath && token) {
        return NextResponse.redirect(new URL("/", request.nextUrl));
    }

    //? If user is NOT logged in (no token) and tries to access protected pages
    //? Redirect them to login page
    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL("/login", request.nextUrl));
    }

    //? If none of the above conditions match, allow the request to proceed
    return NextResponse.next();
}

//? See "Matching paths" below to learn more
//? These are the paths that this middleware will run on
export const config = {
    matcher: [
        "/",
        "/profile",
        "/profile/:path*", //? This matches /profile/[id] and any nested routes
        "/login",
        "/signup"
    ],
};
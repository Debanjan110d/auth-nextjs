//? Import database connection function
import { connectToDB } from "@/dbconfig/dbconfig";
//? Import User model
import User from "@/models/usermodel";
//? Import Next.js server utilities
import { NextRequest, NextResponse } from "next/server";
//? Import bcryptjs for password comparison
import bcryptjs from "bcryptjs";
//? Import jsonwebtoken for creating JWT tokens
import jwt from "jsonwebtoken";

//? Connect to database
connectToDB();

export async function POST(request: NextRequest) {
    try {
        //? Parse request body
        const reqBody = await request.json();
        const { usernameOrEmail, password } = reqBody; //? Accept usernameOrEmail instead of just email
        
        console.log("Login attempt:", { usernameOrEmail });

        //? Find user by email OR username
        const user = await User.findOne({
            $or: [
                { email: usernameOrEmail },      //? Check if it matches email
                { username: usernameOrEmail }    //? Check if it matches username
            ]
        });
        
        //? If user doesn't exist, return error
        if (!user) {
            return NextResponse.json(
                { error: "User not found" }, 
                { status: 400 }
            );
        }

        //? Compare provided password with hashed password in database
        const isPasswordCorrect = await bcryptjs.compare(password, user.password);
        if (!isPasswordCorrect) {
            return NextResponse.json(
                { error: "Invalid credentials" }, 
                { status: 400 }
            );
        }

        //? Create token data (payload for JWT)
        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email
        };

        //? Sign JWT token with secret key (expires in 1 day)
        const token = await jwt.sign(
            tokenData, 
            process.env.TOKEN_SECRET!, 
            { expiresIn: '1d' }
        );

        //? Create response with user data (excluding password)
        const response = NextResponse.json(
            { 
                message: "Login successful", 
                success: true,
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email
                    //? Note: Never return password
                }
            }, 
            { status: 200 }
        );
        
        //? Set JWT token as httpOnly cookie (secure, can't be accessed by JavaScript)
        response.cookies.set("token", token, {
            httpOnly: true, //? Prevents XSS attacks
        });

        return response;

    } catch (error: unknown) { //? Use 'unknown' instead of 'any'
        //? Type guard for error handling
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        console.error("Login error:", errorMessage);
        
        return NextResponse.json(
            { error: errorMessage }, 
            { status: 500 }
        );
    }
}
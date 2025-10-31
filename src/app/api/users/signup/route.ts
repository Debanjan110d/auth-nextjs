import {connect} from "@/dbconfig/dbconfig";
import User from "@/models/usermodel";
import { NextRequest,NextResponse } from "next/server";
import bcryptjs from "bcrypt"; 
import { log } from "console";


connect();


export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json();
        const {username,email,password}= reqBody
        console.log(reqBody);//! NOT Idel for production grade applications
        
        const user = await User.findOne({email});
        if(user){
            return NextResponse.json({error: "User already exists"},{status: 400})
        }

        //? hash the password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password,salt);
        
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });
        
        await newUser.save();
        console.log(newUser);
        
        return NextResponse.json({message: "User created successfully",sucess: true,newUser},{status: 201})
        

    } catch (error: any) {
        return NextResponse.json({error: error.message},{status: 500})
    }
}
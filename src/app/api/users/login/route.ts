import { connect } from '@/dbConfig/dbConfig';
import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

connect();

export async function POST(request:NextRequest){
    try {
        const reqBody = request.json();
        const {email, password} = reqBody;
        console.log(reqBody)

        // check if user exists
        const user = await User.findOne({email});
        if(!user){
            return NextResponse.json({error:"User does not exists"}, {status:409});
        }

        // check if password is correct
        const validPassword = await bcryptjs.compare(password, user.password);
        if(!validPassword){
            return NextResponse.json({error:"Invalid Password!"}, {status:401});
        }

        // create token data
        const tokenData = {
            id: user._id,
            username:user.username,
            email: user.email
        }

        // create token
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn:"1h"});

        // create response
        const response = NextResponse.json({
            message:"Login successful",
            success: true,
        })

        response.cookies.set("token", token, {
            httpOnly:true,
        })

        return response;

    } catch (error: any) {
        return NextResponse.json({error:error.messgae},{status:500});
    }
}
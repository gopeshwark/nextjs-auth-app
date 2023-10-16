import { connect } from '@/dbConfig/dbConfig';
import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import { sendEmail } from '@/helpers/mailer';

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { username, email, password } = reqBody;
        console.log(reqBody);

        // Check if all fields are there
        if (!username || !email || !password) {
            return NextResponse.json({ error: "All fields are mandatory"}, {status: 400 });
        }

        // check if user already exists
        const user = await User.findOne({ email });
        if (user) {
            return NextResponse.json({ error: "User already exists"}, {status: 409 });
        }

        // if all goes well, hash the password
        const salt = await bcryptjs.genSalt(10);
        const encryptedPassword = await bcryptjs.hash(password, salt)

        // Save the user data to database
        const newUser = new User({
            username, email, password: encryptedPassword
        })

        const savedUser = await newUser.save();
        console.log(savedUser);

        // send verification email
        await sendEmail({email, emailType: "VERIFY", userId: savedUser._id});

        return NextResponse.json({ message: "User created successfully", success: true, data: savedUser })
    } catch (error: any) {
        return NextResponse.json({ error: error.message}, {status: 500 })
    }
}
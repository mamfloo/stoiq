import { registerSchema } from "@/lib/types";
import { NextResponse } from "next/server";
import { hash } from "bcrypt"
import { getErrorMessage } from "@/lib/errorToString";
import Users from "@/models/Users";

export async function POST(req: Request) {
    const body = await req.json();
    const result = registerSchema.safeParse(body);

    // check out Zod's .flatten() method for an easier way to process errors
    let zodErrors = {};
    if(!result.success){
        result.error.issues.forEach((issue) => {
            zodErrors = { ...zodErrors, [issue.path[0]]: issue.message };
        });
        return NextResponse.json(
            { errors: zodErrors }
        )
        
    } 
    if(await Users.findOne({username: result.data.username})) {
        return NextResponse.json({error: "Username already in use"});
    }
    if(await Users.findOne({email: result.data.email})) {
        return NextResponse.json({error: "Email already in use"});
    }
    try {
        const hashedPassword = await hash(result.data.password, 10)
        let resultDb = await Users.create({
            username: result.data.username,
            email: result.data.password,
            password: hashedPassword,
            profilePic: "default.png",
            isActivated: true,
            registerDate: Date.now(),
            bio: "something funny",
        });
        return NextResponse.json({body: resultDb}, {status: 200});
    } catch (e) {
        return NextResponse.json({error: getErrorMessage(e)});
    }
    
    
}
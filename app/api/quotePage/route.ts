import { authOptions } from "@/lib/auth";
import { getErrorMessage } from "@/lib/errorToString";
import Users from "@/models/Users";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request){
    const session = await getServerSession(authOptions);
    if(!session){
        return NextResponse.json({message: "You have to login"}, {status: 400})
    }
    try {
        const res = await Users.findOne({_id: session.user.id}).exec();
        if(res){
            return NextResponse.json({quotePage: res.quotePage}, {status: 200})
        } else {
            return NextResponse.json({message: "No user found"}, {status: 400})
        }
    } catch(e){
        return NextResponse.json({message: getErrorMessage(e)}, {status: 400})
    }
}

export async function PUT(req: Request){
    const session = await getServerSession(authOptions);
    if(!session){
        return NextResponse.json({message: "You have to login"}, {status: 400})
    }
    try {
        const reqParse = await req.json();
        const res = await Users.updateOne({_id: session.user.id}, {quotePage: reqParse.quotePage}).exec();
        if(res.modifiedCount === 1){
            return NextResponse.json({message: "Updated"}, {status: 200})
        } else {
            return NextResponse.json({message: "No user found"}, {status: 400})
        }
    } catch(e){
        return NextResponse.json({message: getErrorMessage(e)}, {status: 400})
    }
}
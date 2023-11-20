import { authOptions } from "@/lib/auth";
import { getErrorMessage } from "@/lib/errorToString";
import Saved from "@/models/Saved";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request){
    const session = await getServerSession(authOptions)
    if(!session){
        return NextResponse.json({message: "You have to login first"}, {status: 400});
    }
    try{
        const body = await req.json();
        const del = await Saved.findOneAndDelete({referenceId: body.referenceId, accountId: session.user.id}).exec()
        if(del){
            return NextResponse.json({message: "Unsaved"}, {status: 200});
        } 
        const add = await Saved.create({
            referenceId: body.referenceId,
            saveTime: new Date(),
            accountId: session.user.id.toString(),
            type: body.type
        })
        return NextResponse.json({message: "Saved"}, {status: 200});
    } catch(e){
        return NextResponse.json({message: getErrorMessage(e)}, {status: 400});
    }
}
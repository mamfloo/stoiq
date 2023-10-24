import { authOptions } from "@/lib/auth";
import { getErrorMessage } from "@/lib/errorToString";
import Comment from "@/models/Comment";
import Post from "@/models/Post";
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server";

export async function DELETE(req: Request){
    const session = await getServerSession(authOptions)
    const body = await req.json();
    if(body.username !== session?.user.username){
        return NextResponse.json({message: "You have to login first"}, {status: 200})
    }
    try {
        const mongooseSession = await Comment.startSession();
        await mongooseSession.withTransaction( async () => {
            const com = await Comment.findOneAndDelete({_id: body.commentId})
            const post = await Post.findOneAndUpdate({_id: body.postId}, {$inc: {nComments: -1}})
        })
        await mongooseSession.endSession();
        return NextResponse.json({message: "Comment deleted"}, {status: 200})
    }catch(e){
        return NextResponse.json({message: getErrorMessage(e)}, {status: 200})
    }
}
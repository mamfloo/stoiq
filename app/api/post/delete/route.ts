import { authOptions } from "@/lib/auth";
import { getErrorMessage } from "@/lib/errorToString";
import Comment from "@/models/Comment";
import Like from "@/models/Like";
import Post from "@/models/Post";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions)
    const body = await req.json();
    if(body.username !== session?.user.username && session?.user.username !== undefined){
        return NextResponse.json({message: "You don't have permission to do this"}, {status: 400})
    }
    try {
        const mongooseSession = await Post.startSession();
        await mongooseSession.withTransaction( async () => {
            const com = await Post.findOneAndDelete({_id: body.postId, "author.username": session?.user.username}).exec();
            if(com){
                const comment = await Comment.deleteMany({postId: body.postId, accountId: session?.user.id.toString()})
                const like = await Like.deleteMany({referenceId: body.postId, accountId: session?.user.id.toString()})
            } else {
                throw new Error("Can't delete post.")
            }
        })
        await mongooseSession.endSession();
        return NextResponse.json({message: "Post deleted"}, {status: 200})
    }catch(e){

        return NextResponse.json({message: getErrorMessage(e)}, {status: 400})
    }
}
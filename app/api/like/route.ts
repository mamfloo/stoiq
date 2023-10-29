import { authOptions } from "@/lib/auth";
import { getErrorMessage } from "@/lib/errorToString";
import Comment from "@/models/Comment";
import Like from "@/models/Like";
import Post from "@/models/Post";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if(!session){
        return NextResponse.json({message: "You have to login to like"}, {status: 400})
    }
    try {
        const body = await req.json()
        const res = await Like.findOneAndDelete({referenceId: body.referenceId, accountId: session.user.id}).exec()
        if(res){
            const postRes = await Post.updateOne({_id: body.referenceId},{$inc: {nLikes: -1}}).exec();
            if(postRes.modifiedCount === 0){
                await Comment.updateOne({_id: body.referenceId}, {$inc: {nLikes: -1}}).exec()
            }
            return NextResponse.json({message: "Unliked"}, {status: 200});
        }
        const resCreate = await Like.create({
            referenceId: body.referenceId,
            likeTime: new Date(),
            accountId: session.user.id
        })
        const postRes = await Post.updateOne({_id: body.referenceId},{$inc: {nLikes: 1}}).exec();
        if(postRes.modifiedCount === 0){
            await Comment.updateOne({_id: body.referenceId}, {$inc: {nLikes: 1}}).exec()
        }
        return NextResponse.json({message: "Liked"}, {status: 200});
    } catch(e) {
        return NextResponse.json({message: getErrorMessage(e)}, {status:400});
    }
}
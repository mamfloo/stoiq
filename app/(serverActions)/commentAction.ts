"use server"

import { authOptions } from "@/lib/auth"
import { getErrorMessage } from "@/lib/errorToString";
import { commentSchema } from "@/lib/types";
import Comment, { Comments } from "@/models/Comment";
import Post from "@/models/Post";
import { getServerSession } from "next-auth"

export async function addNewComment(data: unknown){
    const session = await getServerSession(authOptions);
    if(!session){
        return {
            errors: "You have to login to comment."
        }
    }

    let errors = "";
    const parse = commentSchema.safeParse(data);
    if(!parse.success){
        parse.error.issues.map(e => (
            errors = errors + e.path[0] + ": " + e.message + "."
        ))
        return {
            errors: errors
        }
    }
    if(!parse.data.postId){
        return {
            errors: "There has been a problem, try again later."
        }
    }

    try {
        const mongooseSession = await Post.startSession();
        let document;
        const res = await mongooseSession.withTransaction(async () => {
            const postRes = await Post.updateOne({_id: parse.data.postId},{$inc: {nComments: 1}}).exec();
            if(postRes.modifiedCount === 0){
                await Comment.updateOne({_id: parse.data.postId}, {$inc: {nComments: 1}}).exec()
            }
            const doc: Comments = await Comment.create({
                postId: parse.data.postId,
                postTime: Date(),
                text: parse.data.text,
                author: {
                    profilePic: session.user.profilePic,
                    username: session.user.username
                }
            });
            const rest = doc.toJSON();
            delete rest._id;
            delete rest.postId;
            delete rest.author._id;
            document = rest; 
        })
        await mongooseSession.endSession()
        return {
            success: "Comment added successfully",
            post: document
        }
    } catch (e: unknown){
        return {
            errors: getErrorMessage(e)
        }
    }
}

export async function getComments(id: string) {
    try {
        const doc: Comments[] = await Comment.find({postId: id}, {author: {_id: 0}}).lean()
        return {success: doc.map(c => (
            {
                ...c,
                _id: c._id.toString(),
                postId: c.postId.toString() 
            }))}
    } catch(e){
        return {
            errors: getErrorMessage(e),
        }
    }
}
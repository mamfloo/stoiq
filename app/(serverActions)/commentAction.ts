"use server"

import { authOptions } from "@/lib/auth"
import { getErrorMessage } from "@/lib/errorToString";
import { commentSchema } from "@/lib/types";
import Comment, { Comments } from "@/models/Comment";
import Like from "@/models/Like";
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
            delete rest.author._id;
            document = JSON.stringify(rest)
        })
        await mongooseSession.endSession()
        return {
            success: "Comment added successfully",
            comment: document
        }
    } catch (e: unknown){
        return {
            errors: getErrorMessage(e)
        }
    }
}

export async function getComments(id: string) {
    const session = await getServerSession(authOptions);
    try {
        const doc: Comments[] = await Comment.find({postId: id}, {author: {_id: 0}}).lean()
        if(!session){
            return {success: doc.map(c => (
                {
                    ...c,
                    _id: c._id.toString(),
                    postId: c.postId.toString() 
                })
            )}
        }
        const listIdComment: string[] = doc.map(c => (c._id))
        const likes = await Like.find({referenceId: {$in: listIdComment}}).then(l => l.map(i => (i.referenceId.toString())));
        const result = doc.map(p => {
            let isLiked = false;
            if(likes.includes(p._id.toString())){
                isLiked = true;
            }
            return {
                ...p,
                _id: p._id.toString(),
                postId: p.postId.toString(),
                isLiked: isLiked,
            }
        });
        return {
            success: result
        };
    } catch(e){
        return {
            errors: getErrorMessage(e),
        }
    }
}
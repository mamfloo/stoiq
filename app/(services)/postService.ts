"use server"

import { authOptions } from "@/lib/auth";
import { getErrorMessage } from "@/lib/errorToString";
import { newPostSchema } from "@/lib/types";
import Post, { Posts } from "@/models/Post";
import { getServerSession } from "next-auth";

export async function addNewPost(data: unknown){
    const session = await getServerSession(authOptions);
    if(!session?.user.username){
        return {
            errors: "You have to login to post"
        }
    }
    const result = newPostSchema.safeParse(data);
    if(!result.success){
        let errorMessage = "";
        result.error.issues.forEach(issue => {
            errorMessage = errorMessage + issue.path[0] + ": " + issue.message + ". ";
        })
        return {
            errors: errorMessage
        }
    }
    try {
        const newPost = {
            text: result.data.text,
            postTime: Date.now(),
            nLikes: 0,
            nComments: 0,
            author: {
                profilePic: session.user.profilePic,
                username: session.user.username
            }
        }
        const resultDb: Posts = await Post.create(newPost);
        const postData = resultDb.toJSON();
        delete postData._id;
        delete postData.author._id;
        return {
            success: "New post created",
            post: postData
            }
    } catch (e){
        return {
            errors: getErrorMessage(e)
        }
    }
}

export async function getPosts(page: number, count: number){
    try{
        const res: Posts[] = await Post.find({}, {_id: 0, author: {_id: 0}}).sort({postTime: -1}).skip(page * count).limit(count).lean();
        return res;
    } catch (e){
        return {
            errors: getErrorMessage(e)
        }
    }
}


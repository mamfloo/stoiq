"use server"

import { authOptions } from "@/lib/auth";
import { getErrorMessage } from "@/lib/errorToString";
import { newPostSchema } from "@/lib/types";
import Like from "@/models/Like";
import Post, { Posts } from '@/models/Post';
import Saved from "@/models/Saved";
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
            isLiked: false,
            isSaved: false,
            author: {
                profilePic: session.user.profilePic,
                username: session.user.username
            }
        }
        const resultDb: Posts = await Post.create(newPost);
        const postData = resultDb.toJSON();
        
        return {
            success: "New post created",
            post: JSON.stringify(postData)
            }
    } catch (e){
        return {
            errors: getErrorMessage(e)
        }
    }
}

export async function getPosts(page: number, count: number, username?: string){
    const session = await getServerSession(authOptions);
    try{
        let res: Posts[];
        if(!username){
            res = await Post.find({}, {author: {_id: 0}}).sort({postTime: -1}).skip(page * count).limit(count).lean();
        } else {
            res = await Post.find({"author.username": username}, {author: {_id: 0}}).sort({postTime: -1}).skip(page * count).limit(count).lean();
        }
        if(!session){
            return res.map(r => (
                {
                    ...r,
                    _id: r._id.toString(),
                }
            ));
        } else {
            const listIdPost: string[] = res.map(p => (p._id))
            const likes = await Like.find({accountId: session.user.id, referenceId: {$in: listIdPost}}).then(l => l.map(i => (i.referenceId.toString())));
            const saves = await Saved.find({accountId: session.user.id, referenceId: {$in: listIdPost}},).then(l => l.map(i => (i.referenceId.toString())));
            const result = res.map(p => {
                let isLiked = false;
                let isSaved = false;
                if(likes.includes(p._id.toString())){
                    isLiked = true;
                }
                if(saves.includes(p._id.toString())){
                    isSaved = true;
                }
                return {
                    ...p,
                    _id: p._id.toString(),
                    isLiked: isLiked,
                    isSaved: isSaved
                }
            });
            return result;
        }
    } catch (e){
        return {
            errors: getErrorMessage(e)
        }
    }
}


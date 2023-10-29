"use server"

import { authOptions } from "@/lib/auth"
import { getErrorMessage } from "@/lib/errorToString";
import Like from "@/models/Like";
import Post from "@/models/Post";
import Quote from "@/models/Quote";
import Saved from "@/models/Saved";
import { getServerSession } from "next-auth"

export async function getSavedByUsername(username: string, posts: number, pageNumber: number) {
    const session = await getServerSession(authOptions);
    if(session){
        try{
            const res = await Saved.find({accountId: session.user.id}).skip(pageNumber * posts).limit(posts).lean().exec();
            let map = new Map<string, string[]>();
            res.forEach(s => {
                if(s.type === "post"){
                    if(!map.has("post")) {
                        map.set("post", []);
                    }
                    map.get("post")?.push(s.referenceId!.toString());
                } else if(s.type === "quote") {
                    if(!map.has("quote")){
                        map.set("quote", []);
                    }
                    map.get("quote")?.push(s.referenceId!.toString());
                }
            })
            const p = await Post.find({_id: {$in: map.get("post")}}, {author: {_id: 0}}).exec();
            const liked = (await Like.find({referenceId: {$in: p.map(p => p._id)}, accountId: session.user.id}).exec()).map(l => l.referenceId.toString());
            const post = p.map(p => (
                {
                    _id: p._id.toString(),
                    text: p.text,
                    postTime: p.postTime,
                    author: {
                        profilePic: p.author.profilePic,
                        username: p.author.username
                    },
                    nLikes: p.nLikes,
                    nComments: p.nComments,
                    isSaved: true,
                    isLiked: liked.includes(p._id.toString())
                }
            ));
            const q = await Quote.find({_id: {$in: map.get("quote")}}, {author: {_id: 0}}).exec();
            const quotes = q.map(q => {
                return {
                    _id: q._id.toString(),
                    quote: q.quote,
                    author: q.author.toString(),
                    isSaved: true
                };
            });
            return {
                post,
                quotes
            }
        } catch(e){
            return {
                error: getErrorMessage(e)
            }
        }
    } else {
        return {
            error: "You have to login first."
        }
    }
}
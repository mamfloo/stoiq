import { authOptions } from "@/lib/auth";
import { getErrorMessage } from "@/lib/errorToString";
import { TUpdateAccountSchema, updateAccountSchema } from "@/lib/types";
import Account from "@/models/Account";
import Comment from "@/models/Comment";
import Like from "@/models/Like";
import Post from "@/models/Post";
import { writeFile } from "fs/promises";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import path from "path";

const MAX_FILE_SIZE = 1000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export async function POST(req: Request){
    const formData = await req.formData();
    const session = await getServerSession(authOptions);
    if(!session?.user.username){
        return NextResponse.json({errors: "You have to login to update your account"}, {status: 400});
    }
    const daParsare: TUpdateAccountSchema = {
        username: formData.get("username")?.toString() || "",
        bio: formData.get("bio")?.toString() || ""
    }
    const profilePicData = formData.get("profilePicData") as File
    if(profilePicData != null && (profilePicData.size >= MAX_FILE_SIZE || !ACCEPTED_IMAGE_TYPES.includes(profilePicData.type)) ){
        return NextResponse.json({errors: "Image size or type not valid"}, {status: 400})
    }
    const result = updateAccountSchema.safeParse(daParsare);
    if(!result.success){
        let errorMessage = "";
        result.error.issues.forEach(issue => {
            errorMessage = errorMessage + issue.path[0] + ": " + issue.message + ". \n"
        })
        return NextResponse.json({errors: errorMessage}, {status: 400});
    } 
    try { 
        if(session.user.username !== result.data.username || session.user.bio !== result.data.bio){
            const mongooseSession = await Account.startSession();
            await mongooseSession.withTransaction(async () => {
                const doc = await Account.updateOne({email: session.user.email}, 
                    {username: result.data.username, bio: result.data.bio}).session(mongooseSession).exec();
                if(doc.modifiedCount === 0) return NextResponse.json({errors: "There was an error updating the username please try again later"}, {status: 400});
                if(session.user.username !== result.data.username){
                    const likeEdited = await Like.updateMany({"author.username":  session.user.username}, {"author.username": result.data.username}).session(mongooseSession).exec()
                    const postsEdited = await Post.updateMany({"author.username":  session.user.username}, {"author.username": result.data.username}).session(mongooseSession).exec()
                    const commentsEdited = await Comment.updateMany({"author.username":  session.user.username}, {"author.username": result.data.username}).session(mongooseSession).exec()
                }
            })
            await mongooseSession.endSession();
        } 

        if(profilePicData != null){
            const fileName = session.user.id + "." + profilePicData.type.slice(6)
            const doc = await Account.updateOne({email: session.user.email}, 
                {profilePic: fileName});
            const buffer = Buffer.from(await profilePicData.arrayBuffer());   
            writeFile(
                path.join(process.cwd(), "public/img/avatars/" + fileName), buffer
            ) 
        }
    } catch (e) {
        return NextResponse.json({errors: getErrorMessage(e)}, {status: 400});
    }
    return NextResponse.json({success: "Profile updated successfully"}, {status: 200});
    
}
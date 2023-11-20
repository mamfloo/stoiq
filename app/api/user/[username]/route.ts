
import { getErrorMessage } from "@/lib/errorToString";
import Users from "@/models/Users";
import { NextResponse } from "next/server";

export async function GET(req: Request, {params}: {params: {username: string}}){
    try {
        const doc = await Users.findOne({username: params.username}).exec();
        if(doc === null){
          return NextResponse.json({message: "No user was found"}, {status: 400});
        }
        return NextResponse.json({message: "Success",
          body: {
            username: doc.username, 
            profilePic: doc.profilePic, 
            bio: doc.bio, 
            id: doc._id, 
            registerDate: doc.registerDate.toLocaleDateString() 
          }}, {status: 200});
      } catch(e){
        return NextResponse.json({message: getErrorMessage(e)}, {status: 400});
      }
}

import { getErrorMessage } from "@/lib/errorToString";
import Account from "@/models/Account";
import { NextResponse } from "next/server";

export async function GET(req: Request, {params}: {params: {username: string}}){
    try {
        const doc = await Account.findOne({username: params.username}).exec();
        if(doc === null){
          throw Error("No user was found");
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
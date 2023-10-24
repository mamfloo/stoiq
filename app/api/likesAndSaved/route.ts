import { authOptions } from "@/lib/auth";
import { getErrorMessage } from "@/lib/errorToString";
import Like, { Likes } from "@/models/Like";
import Saved, { Saved as ModelSaved} from "@/models/Saved";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request){
    // chiamare prima i like poi i saved con la lista di id presa da req
    const session = await getServerSession(authOptions);
    if(session){
        try {
            const listIdPost: string[] = await req.json();
            const likes = await Like.find({referenceId: {$in: listIdPost}}).then(l => l.map(i => ({id: i._id})));
            const saves = await Saved.find({accountId: session.user.id, referenceId: {$in: listIdPost}},).then(l => l.map(i => ({id: i._id})));
            console.log(likes);
            console.log(saves);
            return NextResponse.json({liked: likes, saved: saves}, {status: 200})
        } catch (e) {
            return NextResponse.json({message: getErrorMessage(e)}, {status: 400})
        }
    } else {
        return NextResponse.json({message: "Not logged"}, {status: 200})
    }
}
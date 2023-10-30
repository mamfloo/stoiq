"use server"

import { authOptions } from "@/lib/auth";
import { getErrorMessage } from "@/lib/errorToString";
import Quote, { Quotes } from "@/models/Quote";
import Saved from "@/models/Saved";
import { getServerSession } from "next-auth";


export async function getQuotes(page: number, count: number){
  const session = await getServerSession(authOptions);
    try {
      const res: Quotes[] = await Quote.find({}).skip(page * count).limit(count).lean();
      if(!session){
        return res;
      } else {
        const postIds = res.map(q => q._id.toString());
        const savedPosts = await Saved.find({accountId: session.user.id, referenceId: {$in: postIds}}).then(savedList => savedList.map(savedElement => savedElement.referenceId.toString()));
        return res.map(q => {
          if(savedPosts.includes(q._id.toString())){
            return {
              ...q,
              _id: q._id.toString(),
              isSaved: true
            } 
          } else {
            return {
              ...q,
              _id: q._id.toString(),
              isSaved: false
            } 
          }
        })
      }     
    } catch(e) {
      return {
        errors: getErrorMessage(e)
      }
    }
  }
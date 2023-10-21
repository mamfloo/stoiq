"use server"

import { getErrorMessage } from "@/lib/errorToString";
import Quote, { Quotes } from "@/models/Quote";


export async function getQuotes(page: number, count: number){
    try {
      const res: Quotes[] = await Quote.find({}, {_id: 0}).skip(page + count).limit(count).lean();
      return res;
    } catch(e) {
      return {
        errors: getErrorMessage(e)
      }
    }
  }
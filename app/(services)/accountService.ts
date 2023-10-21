"use server"
import { authOptions } from "@/lib/auth";
import { getErrorMessage } from "@/lib/errorToString";
import { TUpdateAccountSchema, updateAccountSchema } from "@/lib/types";
import Account from "@/models/Account";
import { writeFile } from "fs/promises";
import { getServerSession } from "next-auth";
import path from "path";

export async function updateAccount(body: unknown){
    
}
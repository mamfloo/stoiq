import { registerSchema } from "@/lib/types";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body: unknown = await req.json();

    const result = registerSchema.safeParse(body);

    // check out Zod's .flatten() method for an easier way to process errors
    let zodErrors = {};
    if(!result.success){
        result.error.issues.forEach((issue) => {
            zodErrors = { ...zodErrors, [issue.path[0]]: issue.message };
        });
    }

    return NextResponse.json(
        Object.keys(zodErrors).length > 0
        ? { errors: zodErrors }
        : { success: true}
    )
}
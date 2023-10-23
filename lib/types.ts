import { z } from "zod";


export const registerSchema = z
    .object({
        username: z.string().min(1, "Username must be at least 1 characters").max(50, "Username must be max 50 characters"),
        email: z.string().email(),
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string().min(8, "Confirm Passowrd must be at least 8 characters"),
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Password must coincide",
        path: ["confirmPassword"]
    });

export type TRegisterSchema = z.infer<typeof registerSchema>;

export const loginSchema = z
    .object({
        username: z.string().min(1, "Username must be at least 1 characters"),
        password: z.string().min(8, "Password must be at least 8 characters")
    });

export type TLoginSchema = z.infer<typeof loginSchema>;

export const newPostSchema = z
    .object({
        text: z.string().min(1, "Write something to post")
    })

export type TNewPostSchema = z.infer<typeof newPostSchema>;

export const likeSchema = z
    .object({
        referenceId: z.string().min(1, "Invalid")
    });

export type TLikeSchema = z.infer<typeof likeSchema>;

export const commentSchema = z
    .object({
        postId: z.string().min(1, "Invalid post").optional(),
        text: z.string().min(1, "Write something")

    })

export type TCommentSchema = z.infer<typeof commentSchema>;


export const updateAccountSchema = z
    .object({
        username: z.string().min(1, "Username must be at least 1 characters").max(50, "Username must be max 50 characters"),
        bio: z.string().max(500, "Bio must be max 50 characters"),
    })

export type TUpdateAccountSchema = z.infer<typeof updateAccountSchema>;
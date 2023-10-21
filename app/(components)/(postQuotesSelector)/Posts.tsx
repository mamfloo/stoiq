"use client"
import { Posts } from "@/models/Post";
import PostCard from "../(card)/PostCard";
import { VscAccount } from "react-icons/vsc";
import { useForm } from "react-hook-form";
import { TNewPostSchema, newPostSchema } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { addNewPost } from "@/app/(services)/postService";
import toast from "react-hot-toast";

export default function Posts({posts} : {posts: Posts[]}) {

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
        reset,
      } = useForm<TNewPostSchema>({
        resolver: zodResolver(newPostSchema)
      })
    
      const onSubmit = async (data: TNewPostSchema) => {
        const result = await addNewPost(data);

        if(result.errors){
            toast.error(result?.errors)
        } else {
            posts.unshift(result.post as Posts);
            reset({text: ""});
        }
      }

    return (
        <>
        <div className='flex flex-col mt-4'>
            <div className="flex items-center">
                <div className="hidden md:inline md:mr-2">
                <VscAccount size="3.5em" />
                </div>
                <form onSubmit={handleSubmit(onSubmit)}
                    className="w-full flex">
                    <input 
                    {...register("text")}
                    type="text" placeholder='What is on your mind...' 
                    className='bg-background rounded-lg border-2 border-accent p-2 w-full h-5/6 outline-none'/>
                    <button disabled={isSubmitting} type="submit" className='ml-2 bg-primary text-black p-2 rounded-lg w-28 disabled:bg-secondary hover:text-white'>Post</button>
                </form>
            </div>
        </div>
        <div className="flex flex-col gap-3 mt-4">
            {posts.map((p, i) => (
            <PostCard key={i} post={p} />
            ))} 
        </div>
    </>
    )
}

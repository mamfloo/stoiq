"use client"
import { Posts } from "@/models/Post";
import PostCard from "../(card)/PostCard";
import { useForm } from "react-hook-form";
import { TNewPostSchema, newPostSchema } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { addNewPost } from "@/app/(serverActions)/postService";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import Image from "next/image";

export default function Posts({posts} : {posts: Posts[]}) {
    const [ imgAvatar, setImgAvatar ] = useState("default.png");

    useEffect(() => {
        const findSession = async () => {
          const session = await getSession()
          if(session) {
            setImgAvatar(session.user.profilePic)
          };
        }
        findSession();
      }, [])

    useEffect(() => {
      //todo chimare endpoint che mi ritorna lista like e saved passando come parametro id dei post
    }, [])

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
                    <Image 
                    className="rounded-full aspect-square"
                    src={"/img/avatars/" + imgAvatar + "?$" + new Date().getTime()} alt={"profile image"} width={60} height={60} loading="lazy"/>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}
                    className="w-full flex">
                    <input 
                    {...register("text")}
                    type="text" placeholder='What is on your mind...' 
                    className='bg-background rounded-lg border-2 border-accent p-2 w-full h-5/6 outline-none focus:border-primary'/>
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

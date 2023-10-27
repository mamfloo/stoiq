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
import { Session } from "next-auth";
import { useRouter } from "next/navigation";

export default function Posts({posts, setPosts} : {posts: Posts[], setPosts: React.Dispatch<React.SetStateAction<Posts[]>>}) {
    const [ imgAvatar, setImgAvatar ] = useState("default.png");
    const [ session, setSession ] = useState<Session | null>()
    const router = useRouter();

    useEffect(() => {
        const findSession = async () => {
          const sessionIns = await getSession()
          if(sessionIns) {
            setImgAvatar(sessionIns.user.profilePic)
            setSession(sessionIns)
          };
        }
        findSession();
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
          let finale: Posts;
          if(result.post){
            finale = JSON.parse(result.post)
          }
          console.log(result.post)
          //posts.unshift(result.post as Posts)
          setPosts(oldPosts => {
            const newPost = [finale, ...oldPosts];
            console.log(newPost)
            return newPost;
          });
          reset({text: ""});
        }
        router.refresh();
      }

      async function deletePost(postId: string){
        console.log(session)
        const result = await fetch("http://localhost:3000/api/post/delete", {
            method:"DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                postId: postId,
                username: session?.user.username
            }) 
        })
        const body = await result.json();
        if(!result.ok){
          toast.error(body.message)
        } else {
          setPosts(p => p.filter(i => i._id.toString() !== postId))
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
                    <button disabled={isSubmitting} type="submit" className='ml-2 bg-primary text-black p-2 rounded-lg w-28 disabled:bg-secondary hover:text-white text-lg'>Post</button>
                </form>
            </div>
        </div>
        <div className="flex flex-col gap-3 mt-4">
            {posts.map((p) => (
            <PostCard key={p._id} post={p} deletePost={deletePost} username={session?.user.username}/>
            ))} 
        </div>
    </>
    )
}

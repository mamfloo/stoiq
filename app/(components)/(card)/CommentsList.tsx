"use client"

import { Comments } from '@/models/Comment'
import React, { useEffect, useState } from 'react'
import Comment from './Comment';
import Image from 'next/image';
import { getSession } from 'next-auth/react';
import { BiCommentAdd } from 'react-icons/bi';
import { useForm } from 'react-hook-form';
import { TCommentSchema, TNewPostSchema, commentSchema } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { addNewComment, getComments } from '@/app/(serverActions)/commentAction';
import { Session } from 'next-auth';

export default function CommentsList({parentId}: {parentId: string}) {
  const [ commentsList, setCommentsList ] = useState<Comments[]>([]);
  const [ imgAvatar, setImgAvatar ] = useState("default.png");
  const [ session, setSession ] = useState<Session | null>();

  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
    reset
  } = useForm<TCommentSchema>({
    resolver: zodResolver(commentSchema)
  })

  useEffect(() => {
      const findSession = async () => {
        const session = await getSession()
        if(session) {
          setImgAvatar(session.user.profilePic)
          setSession(session);
        };
      }
      findSession();
    }, [])

  useEffect(() => {
    async function getAllComment(){
      const comments = await getComments(parentId);
      if(comments.success){
        setCommentsList(comments.success as unknown as Comments[]);
      } else {
        toast.error(comments.errors);
      }
    }
    getAllComment();    
  }, [])

  async function deleteComment(commentId: string){
    const res = await fetch("/comment/delete", {
      method: "DELETE",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        username: session?.user.username,
        commentId: commentId,
        postId: parentId
      })
    })
    const body = await res.json();
    if(res.ok){
      setCommentsList(commentsList.filter(c => {
        if(c._id.toString() === commentId){
          return true;
        }
        return false;
      }))
      toast.success(body.message)
    } else {
      toast.error(body.message)
    }
  }

  async function newComment(schema: TCommentSchema){
    schema.postId = parentId;
    const res = await addNewComment(schema);
    if(res.errors){
      toast.error(res.errors);
    } else if(res.post){
      console.log(res)
      setCommentsList(commentsList.concat(res.post as Comments))
      reset({text: ""})
    }
  }

  return (
    <div className=' w-full'>
      <div className='flex flex-col'>
        {commentsList.map((c, i) => (
          <Comment key={i} comment={c} username={session?.user.username || null} eliminate={deleteComment}/>
        ))} 
      </div>
      <form 
        onSubmit={handleSubmit(newComment)}
        className='flex gap-2 w-full mt-3'>
        <Image 
          className="rounded-full aspect-square"
          src={"/img/avatars/" + imgAvatar} alt={"profile image"} width={45} height={45}/>
        <input 
          {...register("text")}
          className='bg-inherit border-2 border-accent rounded-lg outline-none p-2 w-full focus:border-primary'
          placeholder='Write a comment...'
          type="text" />
          {(errors.postId || errors.text) && (
            <p>{errors.postId?.message} {errors.text?.message} {errors.text?.message}</p>
          ) }
        <button type='submit' className='bg-primary rounded-lg px-4 text-black hover:text-white'>
            <BiCommentAdd size="1.2em"/>
        </button>
      </form>
    </div>
  )
}

"use client"
import { Posts } from '@/models/Post'
import React, { useState } from 'react'
import Image from "next/image"
import { BiCommentDetail, BiLike, BiBookmark } from "react-icons/bi"
import CommentsList from './CommentsList'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import path from 'path'

export default function PostCard({post}: {post: Posts}) {
    const [isHovering, setIsHovering ] = useState(false);
    const [isLiked, setIsLiked ] = useState(false);
    const [isSaved, setIsSaved ] = useState(false);
    const [commentsOpen, setCommentsOpen ] = useState(false);

    const router = useRouter();

    //aggiungere icona like con numeri vicino , commenti = lista di nuovo component Comment che é uguale a PostCard

  return (
    <div 
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="bg-secondary border-2 border-accent rounded-lg p-3 flex">
        <div className=''>
            <Image 
                className="rounded-full aspect-square"
                src={"/img/avatars/" + post.author.profilePic} alt={"profile image"} width={45} height={45}/>
        </div>
        <div className='ml-2 w-full'>
            <div className='flex justify-between w-full'>
    	    <Link 
                href={"/user/" + post.author.username}
                className="text-primary font-semibold">
                @{post.author.username}
            </Link>                
            {isHovering && (
                <button className={`${ isSaved ? 'text-primary' : 'text-slate-300' } hover:text-primary`}>
                    <BiBookmark size={"1.1em"}/>
                </button>
            )}
            </div>
            <p>
                {post.text}
            </p>

            <div className="flex gap-4 mt-1 w-max">
                <button className={`hover:text-primary w-auto flex gap-1 ${isLiked? 'text-primary' : 'text-slate-300'}` } >
                    {post.nLikes !== 0 && <p>{post.nLikes}</p> }
                    <BiLike className="inline-block mt-[3px]" size={"1.1em"}/>
                </button>
                <button
                    onClick={() => setCommentsOpen(!commentsOpen)} 
                    className={`${commentsOpen ? 'text-primary' : 'text-slate-300'} hover:text-primary  w-auto flex gap-1`}>
                    {post.nComments !== 0 && <p>{post.nComments}</p> }
                    <BiCommentDetail className="inline-block mt-[3px]" size={"1.1em"}/>
                </button>
            </div>
            {commentsOpen && <CommentsList parentId={post._id}/>}
        </div>
    </div>
  )
}

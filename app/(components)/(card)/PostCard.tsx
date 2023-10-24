"use client"
import { Posts } from '@/models/Post'
import React, { useEffect, useState } from 'react'
import Image from "next/image"
import { BiCommentDetail } from "react-icons/bi"
import { BsThreeDots } from "react-icons/bs"
import { MdDelete, MdEditNote } from "react-icons/md"
import CommentsList from './CommentsList'
import Link from 'next/link'
import Like from './Like'
import Save from './Save'

export default function PostCard({post}: {post: Posts}) {
    const [isLiked, setIsLiked ] = useState(post.isLiked);
    const [isSaved, setIsSaved ] = useState(post.isSaved);
    const [commentsOpen, setCommentsOpen ] = useState(false);
    const [isEditOpen, setIsEditOpen ] = useState(false);

    const handle = () => setIsEditOpen(false)

    useEffect(() => {
        if(isEditOpen){
            window.addEventListener("touchstart", handle);
            window.addEventListener("scroll", handle);
            return () => {
              window.removeEventListener("scroll", handle);
              window.removeEventListener("touchstart", handle)
            };
        }
    }, [isEditOpen]);

  return (
    <div 
        onMouseLeave={() => {
            setIsEditOpen(false)
        }}
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
                <div className='relative'>
                    <div className='flex gap-1 relative'>
                        <button className='text-accent'
                            onClick={() => setIsEditOpen(!isEditOpen)}>
                            <BsThreeDots className="hover:text-primary" size="1.3em" />
                        </button>
                    </div>
                    {isEditOpen && (
                        <div className='flex gap-2 absolute mt-1 right-7 -top-1'>
                            <button 
                                className='hover:text-primary '>
                                <MdDelete size="1.3em"/>
                            </button>
                            <button className='hover:text-primary '>
                                <MdEditNote size="1.5em"/>
                            </button>
                            
                        </div>
                    )}
                </div>
            </div>
            <p>
                {post.text}
            </p>

            <div className="flex gap-4 justify-between w-full">
                <div className='flex gap-4 mt-1'>
                    <Like nLikes={post.nLikes} isLiked={isLiked} referenceId={post._id} setIsLiked={setIsLiked}/>
                    <button
                        onClick={() => setCommentsOpen(!commentsOpen)} 
                        className={`${commentsOpen ? 'text-primary' : 'text-slate-300'} hover:text-primary  w-auto flex gap-1`}>
                        {post.nComments !== 0 && <p>{post.nComments}</p> }
                        <BiCommentDetail className="inline-block mt-[3px]" size={"1.3em"}/><p className=''>Comment</p> 
                    </button>
                </div>
                <Save isSaved={isSaved} setIsSaved={setIsSaved} referenceId={post._id}/>
            </div>
            {commentsOpen && <CommentsList parentId={post._id}/>}
        </div>
    </div>
  )
}

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

export default function PostCard({post, deletePost, username, removeFromList, removeLikeUnlike, removeAddCommentNumber}: {post: Posts, deletePost: 
    (postId: string) => void, username: string | undefined, removeFromList?: (id: string) => void, removeLikeUnlike?: (id: string, n: number)=> void, removeAddCommentNumber?: (id: string, n: number)=>void} ) {
    const [isLiked, setIsLiked ] = useState(post.isLiked);
    const [isSaved, setIsSaved ] = useState(post.isSaved);
    const [commentsOpen, setCommentsOpen ] = useState(false);
    const [isEditOpen, setIsEditOpen ] = useState(false);
    const [nLikes, setNlikes ] = useState(post.nLikes);
    const [nComments, setNcomments ] = useState(post.nComments)

    const handle = () => setIsEditOpen(false)

    useEffect(() => {
        if(isEditOpen){
            window.addEventListener("scroll", handle);
            return () => {
              window.removeEventListener("scroll", handle);
            };
        }
    }, [isEditOpen]);

  return (
    <div 
        onMouseLeave={() => {
            setIsEditOpen(false)
        }}
        className="bg-secondary border-2 border-accent rounded-lg pt-4 pb-2 px-3 flex">
        <div className=''>
            <Image 
                className="rounded-full aspect-square"
                src={"/img/avatars/" + post.author.profilePic} alt={"profile image"} width={50} height={50}/>
        </div>
        <div className='ml-2 w-full'>
            <div className='flex justify-between w-full -mt-1'>
    	    <Link 
                href={"/user/" + post.author.username}
                className="text-primary font-semibold text-lg">
                @{post.author.username}
            </Link>
            {username === post.author.username && (
                <div className='relative'>
                    <div className='flex gap-1 relative'>
                        <button className='text-accent'
                            onClick={() => setIsEditOpen(!isEditOpen)}>
                            <BsThreeDots className="hover:text-primary" size="1.7em" />
                        </button>
                    </div>
                    {isEditOpen  && (
                        <div className='flex gap-2 absolute mt-1 right-7 -top-1'>
                            <button 
                                onClick={() => deletePost(post._id)}
                                className='hover:text-primary text-slate-300'>
                                <MdDelete size="2em"/>
                            </button>
                            {/*<button className='hover:text-primary '>
                                <MdEditNote size="1.5em"/>
                            </button> */}
                        </div>
                    )}
                </div>
            )}                
        </div>
            <p className='pt-1 mb-1'>
                {post.text}
            </p>

            <div className="flex gap-4 justify-between w-full">
                <div className='flex gap-4 mt-1'>
                    <Like nLikes={nLikes} isLiked={isLiked} referenceId={post._id} setIsLiked={setIsLiked} setNlikes={setNlikes} removeLikeUnlike={removeLikeUnlike}/>
                    <button
                        onClick={() => setCommentsOpen(!commentsOpen)} 
                        className={`${commentsOpen ? 'text-primary' : 'text-slate-300'} hover:text-primary  w-auto flex gap-1`}>
                        {nComments !== 0 && <p className='text-lg'>{nComments}</p> }
                        <BiCommentDetail className="inline-block mt-[3px] text-lg" size={"1.3em"}/><p className='text-lg'>Comment</p> 
                    </button>
                </div>
                {username && (
                    <Save isSaved={isSaved} setIsSaved={setIsSaved} referenceId={post._id} type='post' removeFromList={removeFromList}/>
                )}
            </div>
            {commentsOpen && <CommentsList parentId={post._id} setNcomments={setNcomments} removeAddCommentNumber={removeAddCommentNumber}/>}
        </div>
    </div>
  )
}

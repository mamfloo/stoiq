import React from 'react'
import Image from "next/image"
import { Posts } from '@/models/Post'
import Link from 'next/link'

export default function PostCardSaved({post}: {post: Posts}) {
  return (
    <div 
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
        </div>
            <p className='pt-1 mb-1'>
                {post.text}
            </p>

            <div className="flex gap-4 justify-between w-full">
                <div className='flex gap-4 mt-1'>
                    <Like nLikes={nLikes} isLiked={isLiked} referenceId={post._id} setIsLiked={setIsLiked} setNlikes={setNlikes}/>
                    <button
                        onClick={() => setCommentsOpen(!commentsOpen)} 
                        className={`${commentsOpen ? 'text-primary' : 'text-slate-300'} hover:text-primary  w-auto flex gap-1`}>
                        {nComments !== 0 && <p className='text-lg'>{nComments}</p> }
                        <BiCommentDetail className="inline-block mt-[3px] text-lg" size={"1.3em"}/><p className='text-lg'>Comment</p> 
                    </button>
                </div>
                {username && (
                    <Save isSaved={isSaved} setIsSaved={setIsSaved} referenceId={post._id}/>
                )}
            </div>
            {commentsOpen && <CommentsList parentId={post._id} setNcomments={setNcomments}/>}
        </div>
    </div>
  )
}

import React, { useState } from 'react'
import Image from "next/image"
import { Comments } from '@/models/Comment'
import Link from 'next/link';

export default function Comment({comment}: {comment: Comments}) {
    const [isLiked, setIsLiked ] = useState(false);

  return (
    <div 
        className=" rounded-lg p-1 flex">
        <div className=''>
            <Image 
                className="rounded-full aspect-square"
                src={"/img/avatars/" + comment.author.profilePic} alt={"profile image"} width={45} height={45}/>
        </div>
        <div className='ml-2 w-full'>
            <div className='bg-tertiary p-2 rounded-lg'>

                <div className='flex justify-between w-full'>
                    <Link href={"/user/"+ comment.author.username} className="text-primary font-semibold">
                        @{comment.author.username}
                    </Link>
                </div>
                <p>
                    {comment.text}
                </p>
            </div>
            <div className="flex gap-3 ml-2 w-max">
                <button className={`hover:text-primary w-auto flex gap-1 ${isLiked? 'text-primary' : 'text-slate-300'}` } >
                    {comment.nLikes !== 0 && <p>{comment.nLikes}</p> }
                    <p>Like</p>
                </button>
                <button 
                    className='hover:text-primary text-slate-300 w-auto flex gap-1'>
                    <p>Reply</p>
                </button>
            </div>
        </div>
    </div>
  )
}

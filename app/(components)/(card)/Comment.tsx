import React, { useState } from 'react'
import Image from "next/image"
import { Comments } from '@/models/Comment'
import Link from 'next/link';
import { BsThreeDots } from 'react-icons/bs';
import { MdDelete } from 'react-icons/md';
import Like from './Like';

export default function Comment({comment, username, eliminate}: {comment: Comments, username: string | null, eliminate: (commentId: string) => void}) {
    const [isLiked, setIsLiked ] = useState(comment.isLiked);
    const [isEditOpen, setIsEditOpen ] = useState(false);
    const [nLikes, setNlikes ] = useState(comment.nLikes)

  return (
    <div 
        className=" rounded-lg p-1 flex">
        <div className=''>
            <Image 
                className="rounded-full aspect-square"
                src={"/img/avatars/" + comment.author.profilePic + "?$" + new Date().getTime()} alt={"profile image"} width={45} height={45}/>
        </div>

        <div className='ml-2 w-full'>
            <div className='bg-tertiary p-2 rounded-lg'>
                <div className='flex justify-between'>
                    <div className='flex justify-between w-full'>
                        <Link href={"/user/"+ comment.author.username} className="text-primary font-semibold">
                            @{comment.author.username}
                        </Link>
                    </div>
                    {username === comment.author.username &&
                                <div className='relative'>
                                    <div className='flex gap-1'>
                                        <button
                                            onClick={() => setIsEditOpen(!isEditOpen)}>
                                            <BsThreeDots className="hover:text-primary mt-1 text-accent" size="1.7em" />
                                        </button>
                                    </div>
                                    {isEditOpen && (
                                        <div className='flex flex-col gap-2 absolute mt-1 -left-6 top-0 text-slate-300'>
                                            <button 
                                                onClick={() => eliminate(comment._id)}
                                                className='hover:text-primary '>
                                                <MdDelete size="1.7em"/>
                                            </button>
                                            {/*<button className='hover:text-primary '>
                                                <MdEditNote size="1.3em"/>
                                            </button>   */}
                                        </div>
                                    )}
                                </div>
                            }
                    </div>
                <p>
                    {comment.text}
                </p>
            </div>
            <div className="flex ml-2 gap-3 w-max justify-between">
                <div className='flex ml-2 gap-3 w-max justify-between'>
{/*                     <button className={`hover:text-primary w-auto flex gap-1 ${isLiked? 'text-primary' : 'text-slate-300'}` } >
                        {comment.nLikes !== 0 && <p>{comment.nLikes}</p> }
                        <p>Like</p>
                    </button> */}
                    <Like nLikes={nLikes} isLiked={isLiked} referenceId={comment._id} setIsLiked={setIsLiked} setNlikes={setNlikes} includeIcon={false}/>
                </div>
            </div>
        </div>
    </div>
  )
}

import { Posts } from '@/models/Post'
import React from 'react'
import Image from "next/image"

export default function PostCard({post}: {post: Posts}) {


    //aggiungere icona like con numeri vicino , commenti = lista di nuovo component Comment che é uguale a PostCard

  return (
    <div className="bg-secondary border-2 border-accent rounded-lg p-3 flex">
        <div className=''>
            <Image 
                className="rounded-full aspect-square"
                src={"/img/avatars/" + post.author.profilePic} alt={"profile image"} width={45} height={45}/>
        </div>
        <div className='ml-2'>
            <p className="text-primary font-semibold">
                @{post.author.username}
            </p>
            <p>
                {post.text}
            </p>
        </div>
    </div>
  )
}

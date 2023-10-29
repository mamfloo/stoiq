"use client"
import React from 'react'
import toast from 'react-hot-toast';
import { BiLike } from 'react-icons/bi'

export default function Like({nLikes, isLiked, referenceId, setIsLiked, setNlikes, includeIcon = true, removeLikeUnlike}: 
    {nLikes: number, isLiked: boolean, referenceId: string, setIsLiked: (b: boolean) => void, setNlikes: React.Dispatch<React.SetStateAction<number>>, includeIcon?: boolean, removeLikeUnlike?: (id:string, n: number)=>void}) {

    async function like(){
        const res = await fetch("/api/like", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                referenceId
            })
        })
        if(res.ok){
            const final = await res.json()
            setNlikes((n: number) => {
                if(isLiked){
                    if(removeLikeUnlike){
                        removeLikeUnlike(referenceId, -1)
                    }
                    return n-1
                } else {
                    if(removeLikeUnlike){
                        removeLikeUnlike(referenceId, 1)
                    }
                    return n+1
                }
                })
            setIsLiked(!isLiked);
        } else {
            const final = await res.json()
            toast.error(final.message);
        }
    }

  return (
    <div>
        <button 
            onClick={like}
            className={`hover:text-primary w-auto flex gap-1 text-lg ${isLiked? 'text-primary' : 'text-slate-300'}` } >
            {nLikes !== 0 && <p>{nLikes}</p> }
            {includeIcon &&
                <BiLike className="inline-block" size={"1.3em"}/> 
            }
            Like
        </button>
    </div>
  )
}

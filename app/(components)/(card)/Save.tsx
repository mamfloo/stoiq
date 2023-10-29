import React from 'react'
import toast from 'react-hot-toast'
import { BiBookmark } from 'react-icons/bi'

export default function Save({isSaved = false, setIsSaved, referenceId, type, removeFromList}: 
    {isSaved: boolean, setIsSaved: (b: boolean) => void, referenceId: string, type: string, removeFromList?: (id: string) => void}) {
    async function save(){

        const res = await fetch("/api/save",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                referenceId,
                type
            })
        })
        if(res.ok){
            const final = await res.json()
            setIsSaved(!isSaved)
            if(final.message === "Unsaved") {
                if(removeFromList){
                    removeFromList(referenceId);
                }
            }
        } else {
            const final = await res.json()
            toast.error(final.message);
        }
    }

  return (
    <button 
        onClick={save}
        className={`${ isSaved ? 'text-primary' : 'text-accent' } hover:text-primary`}>
        <BiBookmark size={"2em"}/>
    </button>
  )
}

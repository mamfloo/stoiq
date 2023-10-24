import React from 'react'
import toast from 'react-hot-toast'
import { BiBookmark } from 'react-icons/bi'

export default function Save({isSaved, setIsSaved, referenceId}: {isSaved: boolean, setIsSaved: (b: boolean) => void, referenceId: string}) {

    async function save(){
        console.log(isSaved)
        console.log(referenceId)
        console.log("asd")
        const res = await fetch("/api/save",{
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
            console.log(final.message)
            setIsSaved(!isSaved)
        } else {
            const final = await res.json()
            toast.error(final.message);
        }
    }

  return (
    <button 
        onClick={save}
        className={`${ isSaved ? 'text-primary' : 'text-slate-300' } hover:text-primary`}>
        <BiBookmark size={"1.3em"}/>
    </button>
  )
}

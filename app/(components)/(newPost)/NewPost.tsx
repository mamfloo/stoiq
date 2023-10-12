import Image from "next/image"
import UserIcon from "@/public/img/user.png"
import { VscAccount } from "react-icons/vsc";

export default function NewPost() {
  return (
    <div className='flex flex-col'>
        <div className="flex items-center">
            <VscAccount size="3.5em" />
            <input type="text" placeholder='What is on your mind...' 
                className='ml-2 bg-background rounded-lg border-2 border-accent p-2 w-full h-5/6 outline-none'/>
        </div>

        <button className='bg-primary text-black p-2 rounded-lg px-5  mt-2'>Post</button>
    </div>
  )
}

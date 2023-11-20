import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import { getServerSession } from "next-auth"
import { BiBookmark } from "react-icons/bi";
import Image from "next/image"
import { FiSettings } from 'react-icons/fi';
import LoginLogout from './LoginLogout';
import Users from '@/models/Users';
import dbConnect from '@/lib/mongo/connect';

export default async function Settings() {

    const session = await getServerSession(authOptions)
    await dbConnect();
    const user = await Users.findOne({_id: session?.user.id},{_id: 0, profilePic: 0}).exec();

  return (
    <div className='flex flex-col gap-3 items-end'>
        <button className='self-end hover:bg-secondary px-2 rounded-lg ml-2'>
          <div className=''>
            <Link className="text-primary font-mono text-3xl" href={"/"}>stoiq</Link>
          </div>
        </button>
        {session?.user && (
            <div className='flex flex-col gap-3 items-end'>
                <button className=''>
                    <div className=''>
                        <Link className="text-slate-300  font-mono text-xl flex gap-2 hover:text-primary" href={"/user/"+ user?.username}>
                            profile
                            <Image 
                                className="rounded-full aspect-square border-2 border-primary"
                                src={"/img/avatars/" + session?.user.profilePic + "?$" + new Date().getTime()} alt={"profile image"} width={35} height={35}/>
                            </Link>
                    </div>
                </button>
                <button className=''>
                    <div className=''>
                        <Link className="text-slate-300  font-mono text-xl flex gap-2 hover:text-primary" href={"/settings"}>settings <FiSettings size="1.4em"/> </Link>
                    </div>
                </button>
                <button className=''>
                    <div className=''>
                        <Link className="text-slate-300  font-mono text-xl flex gap-2 hover:text-primary" href={"/saved"}>saved <BiBookmark size="1.4em"/> </Link>
                    </div>
                </button>  
            </div>
        )}
        <LoginLogout session={session}/>      
        <div className='hidden md:inline-block lg:hidden text-end fixed bottom-1'>
            <div className=' flex flex-col'>
                <Link href={"/terms"} className='hover:underline'>Terms and Conditions</Link>
                <Link href={"/about"} className='hover:underline'>About</Link>
            </div>
            <Link href={"https://www.linkedin.com/in/nicolaeb/"} target='_blank'>by mamflo</Link>
        </div>
    </div>
  )
}

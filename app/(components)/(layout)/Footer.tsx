import Account from '@/models/Account'
import Link from 'next/link'
import React from 'react'
import Image from "next/image"
import { AiOutlineCalendar } from 'react-icons/Ai';

export default async function Footer() {

  const users = await getUsers();
  console.log(users)


  return (
    <div className='flex flex-col gap-2 w-full'>
        <div>
            <h2 className='text-primary text-xl mb-2'>Active Users</h2>
            {users.map((a, i) => (
                <div key={i} className='flex gap-3 rounded-lg border-accent border-2 mb-2 p-3'>
                    <div className='aspect-square'>
                        <Image className='rounded-full border-2 border-primary aspect-square' 
                            src={'/img/avatars/' + a.profilePic} alt={'avatar image stoiq'} height={50} width={50}/>
                    </div>
                    <div className='flex flex-col gap-1 justify-center'>
                        <Link className='text-primary font-semibold text-lg flex' href={'/user/' + a.username}>@{a.username} </Link>
                        <p>{a.bio}</p>
                        {/* <div className='flex'>
                            <div className='mt-1'>
                                <AiOutlineCalendar size={"1.1em"} />
                            </div> 
                            <p className='ml-1'> Joined {a.registerDate.toLocaleDateString()}</p>
                        </div> */}
                    </div> 
                </div>
            ))}
        </div>
        <div className=' flex gap-3'>
            <Link href={"/terms"} className='hover:underline'>Terms and Conditions</Link>
            <Link href={"/about"} className='hover:underline'>About</Link>
        </div>
        <Link href={"https://www.linkedin.com/in/nicolaeb/"} target='_blank'>by mamflo</Link>
    </div>
  )
}

async function getUsers(){
    return await Account.aggregate([{$sample: {size: 5}}]).exec();
}

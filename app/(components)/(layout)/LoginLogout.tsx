"use client"

import { Session } from 'next-auth'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { BiLogInCircle, BiLogOutCircle } from 'react-icons/bi'
import Login from '../(loginPopUp)/Login'
import Register from '../(registerPopUp)/Register'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginLogout({session}: {session: Session | null}) {
    const [ isLoginOpen, setIsLoginOpen] = useState(false)
    const [ isRegisterOpen, setIsRegisterOpen] = useState(false)
    const router = useRouter();

    let popUpsRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      let handler = (e: TouchEvent | MouseEvent) => {
        if(!popUpsRef.current?.contains(e.target as Node)){
          setIsLoginOpen(false);
          setIsRegisterOpen(false);
        }
      } 
  
      document.addEventListener("mousedown", handler);
      return () => {
        document.removeEventListener("mousedown", handler);
      }  
    })


    function openRegisterPopUp(){
        setIsLoginOpen(false);
        setIsRegisterOpen(true);
      }
    
      function openLoginPopUp(){
        setIsRegisterOpen(false);
        setIsLoginOpen(true);
      }
    
      function afterLoginOrRegister(){
        setIsRegisterOpen(false);
        setIsLoginOpen(false);
        router.refresh();
      }
  return (
    <div className='flex flex-col items-end'>
        {session?.user && (
            <button 
                onClick={() => signOut()}
                className=''>
                <div className=''>
                    <Link className="text-slate-300  font-mono text-xl flex gap-2 hover:text-primary" href={"/"}>logout <BiLogOutCircle size="1.4em"/> </Link>
                </div>
            </button>
        )}
        {!session?.user && (
            <button
                onClick={() => setIsLoginOpen(!isLoginOpen)} 
                className=''>
                <div className=''>
                    <Link className="text-slate-300 font-mono text-xl flex gap-2 hover:text-primary" href={"/"}>login <BiLogInCircle size="1.4em"/></Link>
                </div>
            </button>
        )}
        <div ref={popUpsRef} className="absolute">
        {isLoginOpen && <Login openRegisterPopUp={openRegisterPopUp} afterLoginOrRegister={afterLoginOrRegister}/>}
        {isRegisterOpen && <Register openLoginPopUp={openLoginPopUp} afterLoginOrRegister={afterLoginOrRegister}/>}
      </div>
    </div>
  )
}

"use client"

import Image from "next/image"
import { useState } from "react";
import { BsBookmark } from "react-icons/bs";
import { VscAccount } from "react-icons/vsc";
import Login from "../(loginPopUp)/Login";
import Register from "../(registerPopUp)/Register";
import { useRef, useEffect } from "react"


export default function Navbar() {
  const [ isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)

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
  

  return (
    <div className='sticky top-0 flex gap-2 bg-secondary justify-between px-1'>
        <button className='bg-secondary'>
            <div className='p-3'>
            <BsBookmark size="1.8em" />
            </div>
        </button>
        <button className='bg-secondary'>
            <div className=''>
              <p className="text-primary font-mono text-2xl">stoiq</p>
            </div>
        </button>
        <button className='bg-secondary' onClick={() => setIsLoginOpen(!isLoginOpen)}>
            <div className='p-3'>
            <VscAccount size="2em" />
            </div>
        </button>
        <div ref={popUpsRef} className="absolute">
          {isLoginOpen && <Login openRegisterPopUp={openRegisterPopUp}/>}
          {isRegisterOpen && <Register openLoginPopUp={openLoginPopUp}/>}
        </div>
        
    </div>
  )
}

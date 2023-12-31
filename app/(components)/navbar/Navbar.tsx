"use client"

import Image from "next/image"
import { useState } from "react";
import { BiBookmark } from "react-icons/bi";
import { BiLogInCircle, BiLogOutCircle } from "react-icons/bi";
import { VscAccount } from "react-icons/vsc";
import Login from "../(loginPopUp)/Login";
import Register from "../(registerPopUp)/Register";
import { useRef, useEffect } from "react"
import { getSession, signOut } from "next-auth/react";
import { FiSettings } from "react-icons/fi"
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function Navbar() {
  const [ isLoginOpen, setIsLoginOpen] = useState(false)
  const [ isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [ session, setSession ] = useState<Session | null>(null);
  const [ isOptionOpen, setIsOptionOpen ] = useState(false);

  const router = useRouter();

  //let session;
  useEffect(() => {
    const findSession = async () => {
      const session = await getSession()
      if(session) {
        setSession(session)
      };

    }
    findSession();
  }, [isLoginOpen, isRegisterOpen])

  let popUpsRef = useRef<HTMLDivElement>(null);
  let optionMenuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let handler = (e: TouchEvent | MouseEvent) => {
      if(!popUpsRef.current?.contains(e.target as Node) && !optionMenuRef.current?.contains(e.target as Node)){
        setIsLoginOpen(false);
        setIsRegisterOpen(false);
        setIsOptionOpen(false);
      }
    } 

    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    }  
  })

  useEffect(() => {
    if(isLoginOpen || isRegisterOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset"
  }, [isLoginOpen, isRegisterOpen])

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
  }

  function navigateTo(page: string) {
    router.replace(page);
    setIsOptionOpen(false);
  }
  

  return (
    <div className='top-0 flex gap-2 bg-secondary justify-between px-1 items-center z-10'>
      <div>
        <div className="w-10">
          {session && 
            <button 
              onClick={() => navigateTo("/saved")}
              className='bg-secondary'>
              <div className='p-3 hover:text-primary text-slate-300'>
                <BiBookmark size="2.5em" />
              </div>
            </button>
          }
        </div>
      </div>
      <button className='bg-secondary'>
          <div className=''>
            <Link className="text-primary font-mono text-2xl" href={"/"}>stoiq</Link>
          </div>
      </button>
      <div>
        {!session && 
          <button className='bg-secondary' 
            onClick={() => setIsLoginOpen(!isLoginOpen)}>
            <div className='p-3  hover:text-primary'>
              <BiLogInCircle size="2.5em" />
            </div>
          </button> 
        }
        {session && 
        <div className="relative w-10 mr-2">
          <button className='bg-secondary'
            onClick={() => setIsOptionOpen(!isOptionOpen)}>
              <Image 
                className="rounded-full aspect-square"
                src={"/img/avatars/" + session.user.profilePic + "?$" + new Date().getTime()} alt={"profile image"} width={50} height={50}/>
          </button>
          {isOptionOpen && 
              <div ref={optionMenuRef} 
                className="flex flex-col absolute gap-3 right-1/4 bg-secondary border-2 border-accent rounded-lg p-3 px-5 -mt-3">
                <button 
                  onClick={() => navigateTo("/user/" + session.user.username)}
                  className="flex content-center items-center hover:text-primary text-lg">
                  <div className="inline-block align-bottom">< VscAccount size={"1.5em"} /></div>
                  <p className="mb-1 ml-1">profile</p>
                </button>
                <button 
                  onClick={() => navigateTo("/settings")}
                  className="flex content-center items-center hover:text-primary text-lg">
                  <div className="inline-block align-bottom">< FiSettings size={"1.5em"} /></div>
                  <p className="mb-1 ml-1">settings</p>
                </button>
                <button className="flex content-center item hover:text-primary text-lg"
                  onClick={() => signOut()}>
                  <div className="inline-block align-bottom">< BiLogOutCircle size={"1.5em"}/></div>
                  <p className="mb-1 ml-1">logout</p>
                </button>
              </div>
            }
        </div>
        }
      </div> 
      <div ref={popUpsRef} className="absolute">
        {isLoginOpen && <Login openRegisterPopUp={openRegisterPopUp} afterLoginOrRegister={afterLoginOrRegister}/>}
        {isRegisterOpen && <Register openLoginPopUp={openLoginPopUp} afterLoginOrRegister={afterLoginOrRegister}/>}
      </div>
        
    </div>
  )
}

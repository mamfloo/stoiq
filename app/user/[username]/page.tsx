"use client"

import PostCard from '@/app/(components)/(card)/PostCard';
import { Posts } from '@/models/Post';
import { Session } from 'next-auth'
import Image from "next/image"
import Link from 'next/link';
import { useEffect, useRef, useState, useTransition } from 'react';
import toast from 'react-hot-toast';
import { AiOutlineCalendar } from "react-icons/Ai"
import { TbEdit } from "react-icons/tb"
import { Posts as PostsModel }  from '@/models/Post';
import { useIntersection } from '@mantine/hooks';
import { getPosts } from '@/app/(serverActions)/postService';
import { getSession } from 'next-auth/react';
import Loading from '@/app/(components)/Loading';

export default function page({params}: {params: {username: string}} ) {
    let [ isPending, startTransition ] = useTransition();
    const [ posts, setPosts ] = useState<PostsModel[]>([]);
    const [ pagePosts, setPagePosts ] = useState(0);
    const [ isFetching, setIsFetching ] = useState(false);  
    const [ user, setUser ] = useState<{ username: string; profilePic: string; bio: string; id: string; registerDate: string; }>();
    const [ sessionUser, setSessonUser ] = useState<Session | null>();
    const [ noUserFound, setNoUserFound ] = useState(true);
    let isSameUser = false;

    useEffect(() => {
      const getS = async () => {
        const session = await getSession();
        if(session?.user.username === params.username){
          const date = new Date(session.user.registerDate).toLocaleDateString();
          setUser({
            ...session.user,
            registerDate: date
          });
          setSessonUser(session);
          isSameUser = true;
          setNoUserFound(false);
        } else {
          const res = await fetch("http://localhost:3000/api/user/" + params.username);
          const u = await res.json();
          if(res.ok){
            setNoUserFound(false);
            setUser(
              {
                username: u.body.username,
                profilePic: u.body.profilePic,
                bio: u.body.bio,
                id: u.body.id,
                registerDate: u.body.registerDate
              }
            )
          } else {
            setNoUserFound(true);
            toast.error(u.message);
          }
        }
      }
      getS();
    }, [])

    const getP = async () => {
      setIsFetching(true);
      const postsRes = await getPosts(pagePosts, 100, params.username);
      if(Array.isArray(postsRes)){
          setPosts(postsRes as PostsModel[])
      } else {
          toast.error(postsRes.errors)
      }
      setIsFetching(false);
  }

  async function deletePost(postId: string){
    const result = await fetch("http://localhost:3000/api/post/delete", {
        method:"DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            postId: postId,
            username: user!.username
        }) 
    })
    const body = await result.json();
    if(!result.ok){
      toast.error(body.message)
    } else {
      setPosts(p => p.filter(i => i._id.toString() !== postId))
    }
  } 

  const lastElementRef = useRef<HTMLElement>(null);
  const { ref, entry } = useIntersection({
      root: lastElementRef.current,
      threshold: 1
  })

  useEffect(()=>{
    getP()
    if(entry?.isIntersecting) getP();
  },[entry])

  if(noUserFound){
    return (
      <Loading/>
    )
  } else {
    return (
      <div className='flex flex-col w-full'>
        <div className='flex gap-3 rounded-lg border-accent border-2 mb-2 p-3'>
          <div className='aspect-square'>
            <Image className='rounded-full border-2 border-primary aspect-square' 
              src={'/img/avatars/' + user?.profilePic} alt={'avatar image stoiq'} height={100} width={100}/>
          </div>
          <div className='flex flex-col gap-1 justify-center'>
            <p className='text-primary font-semibold text-lg flex'>@{user?.username} <Link className='mt-1 ml-1 text-white' href={"/settings"}>{isSameUser && <TbEdit/>}</Link></p>
            <p>{user?.bio}</p>
            <div className='flex'>
              <div className='mt-1'><AiOutlineCalendar size={"1.1em"} /></div> <p className='ml-1'> Joined {user?.registerDate}</p>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          {Array.isArray(posts) && posts.map((p) => (
              <PostCard key={p._id} post={p as Posts} username={sessionUser?.user.username} deletePost={deletePost}/>
            ))}
        </div>
        {/* <div ref={ref} className='h-1'></div>             without this it does not reqest any other post when it reaches the botto of the page */}
        {isFetching && <div className='mx-auto mt-2 h-16 w-16 animate-spin rounded-full border-t border-accent'></div>}
      </div>
    )
  }
    
}


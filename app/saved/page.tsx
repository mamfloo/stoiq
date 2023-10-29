"use client"

import PostCard from '@/app/(components)/(card)/PostCard';
import { Posts } from '@/models/Post';
import { Session } from 'next-auth'
import { useEffect, useRef, useState, useTransition } from 'react';
import toast from 'react-hot-toast';
import { Posts as PostsModel }  from '@/models/Post';
import { useIntersection } from '@mantine/hooks';
import { getPosts } from '@/app/(serverActions)/postService';
import { getSession } from 'next-auth/react';
import Quote, { Quotes } from '@/models/Quote';
import { getSavedByUsername } from '../(serverActions)/savedAction';
import QuoteCard from '../(components)/(card)/QuoteCard';

export default function page() {
    const [ state, setState ] = useState(0);
    const [ savedPosts, setSavedPosts ] = useState<PostsModel[]>([]);
    const [ savedQuotes, setSavedQuotes ] = useState<Quotes[]>([]);
    const [ pagePosts, setPagePosts ] = useState(0);
    const [ isFetching, setIsFetching ] = useState(false);  
    const [ session, setSesson ] = useState<Session | null>();
    let isSameUser = false;

    useEffect(() => {
      const getSes = async () => {
        const session = await getSession();
        if(session){
          console.log(session)
          setSesson(session);
          isSameUser = true;
        }
        getS(session!);
      }
      getSes();
    }, [])

    const getS = async (session: Session) => {
      setIsFetching(true);
      const res = await getSavedByUsername(session!.user.username, 100, pagePosts);
      if(res.error){
        toast.error(res.error)
      }else {
        setSavedPosts(res.post as unknown as PostsModel[]);
        setSavedQuotes(res.quotes as unknown as Quotes[]);
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
            username: session?.user.username
        }) 
    })
    const body = await result.json();
    if(!result.ok){
      toast.error(body.message)
    } else {
      setSavedPosts(p => p?.filter(i => i._id.toString() !== postId))
    }
  } 

  const lastElementRef = useRef<HTMLElement>(null);
  const { ref, entry } = useIntersection({
      root: lastElementRef.current,
      threshold: 1
  })

  function removeQuote(id: string){
    setSavedQuotes(savedQuotes.filter(q => q._id !== id));
  }

  function removePost(id: string){
    setSavedPosts(savedPosts.filter(p => p._id !== id));
  }

  function removeLikeUnlike(id: string, n: number) {
    const s = savedPosts.map(p => {
      if (p._id.toString() === id) {
        return {
          ...p,
          isLiked: !p.isLiked,
          nLikes: p.nLikes + n
        };
      }
      return p;
    })
    setSavedPosts(s as PostsModel[]);
  }

  function removeAddCommentNumber(id: string, n: number){
    const s = savedPosts.map(p => {
      if (p._id.toString() === id) {
        return {
          ...p,
          nComments: p.nComments + n
        };
      }
      return p;
    })
    setSavedPosts(s as PostsModel[]);
  }

/*   useEffect(()=>{
    if(entry?.isIntersecting) getS();
  },[entry]) */
    
  return (
    <>
    <div  className='flex gap-2 mt-1 mb-3'>
            <button
                onClick={() => {setState(0)}} 
                className='text-text bg-secondary w-full py-2 pb-3 rounded-lg border-2 border-primary hover:text-primary text-xl'>posts</button>
            <button 
                onClick={() => {setState(1)}}
                className='text-text bg-secondary w-full py-2 pb-3 rounded-lg border-2 border-primary hover:text-primary text-xl '>quotes</button>
        </div>
    <div className='flex flex-col w-full'>
      <div className='flex flex-col gap-2'>
        {(state === 0) && savedPosts.map((p) => (
          <PostCard key={p._id} post={p as Posts} username={session?.user.username} deletePost={deletePost} removeFromList={removePost} removeLikeUnlike={removeLikeUnlike} removeAddCommentNumber={removeAddCommentNumber}/>
        ))}
        {(state === 1) && savedQuotes.map(q => (
          <QuoteCard quote={q} removeFromList={removeQuote}/>
        ))}
      </div>
      {/* <div ref={ref} className='h-1'></div> not active (infinite scroll)*/}
      {isFetching && <div className='mx-auto mt-2 h-16 w-16 animate-spin rounded-full border-t border-accent'></div>}
    </div>
    </>
  )
}


"use client"

import React, { useEffect, useRef, useState, useTransition } from 'react'
import Quotes from './Quotes';
import Posts from './Posts';
import { Quotes as QuotesModel } from '@/models/Quote';
import { Posts as PostsModel }  from '@/models/Post';
import { getQuotes } from '@/app/(serverActions)/quoteService';
import toast from 'react-hot-toast';
import { getPosts } from '@/app/(serverActions)/postService';
import { useIntersection } from '@mantine/hooks';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';

export const revalidate = 5;

export default function PostQuotesSelector() {
    //if state 0 then posts, if = 1 then quotes
    const [state, setState] = useState(0);
    let [ isPending, startTransition ] = useTransition();
    const [ quotes, setQuotes ] = useState<QuotesModel[]>([]);
    const [ posts, setPosts ] = useState<PostsModel[]>([]);
    const [ pagePosts, setPagePosts ] = useState(0);
    const [ pageQuotes, setPageQuotes ] = useState(0);
    const [ isFetching, setIsFetching ] = useState(false);  
    const [ session, setSession ] = useState<Session | null>(null);
    const [ firstRequestDone, setFirstRequestDone ] = useState(false);
    
    useEffect(() => {
        const getPage = async () => {
            const sessionFound = await getSession();
            console.log(sessionFound);
            if(sessionFound !== null){
                setSession(sessionFound)
                const res = await fetch("http://localhost:3000/api/quotePage");
                const body = await res.json();
                if(res.ok){
                    setPageQuotes(body.quotePage)
                } else {
                    toast.error(body.error)
                }
            } else {
                setPageQuotes(0);
            }
        }
        getPage()
        
    }, [])
    //send the nexpage to the api before exiting the component
    const updatePage = async () => {
        if(session !== null){
        const res = await fetch("http://localhost:3000/api/quotePage", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                quotePage: pageQuotes
            })
        })
        const parsed = await res.json();
        if(!res.ok){
            toast.error(parsed.message)
        }
        }
    }

    const getQ = async () => {
        setPosts([]);
        setPagePosts(0);
        setState(1);
        setIsFetching(true);
        const quotes = await getQuotes(pageQuotes, 15);
        if(Array.isArray(quotes)) {
            setQuotes(qOld => (
                qOld.concat(quotes as QuotesModel[])
            ));
            setPageQuotes(pageQuotes + 1);
            if(firstRequestDone){
                updatePage();
            }
            setFirstRequestDone(true);
        } else {
            toast.error(quotes.errors);
        }
        setIsFetching(false);
    }

    const getP = async () => {
        setQuotes([]);
        //setPageQuotes(0);
        setState(0);
        setIsFetching(true);
        const postsRes = await getPosts(pagePosts, 15);
        if(Array.isArray(postsRes)){
            if (posts.length === 0){
                setPosts(postsOld => {
                    return postsOld.concat(postsRes as PostsModel[]);
                });
            } else if( posts.length !== 0 && posts[posts.length - 1]?.text !== postsRes[postsRes.length - 1]?.text ){
                const newElements = postsRes.filter((p) => !posts.includes(p as PostsModel));
                setPosts(postsOld => {
                    return postsOld.concat(newElements as PostsModel[]);
                });
            }
            if(postsRes.length === 15){
                setPagePosts(pagePosts + 1);
            } 
        } else {
            toast.error(postsRes.errors)
        }
        setIsFetching(false);
    }

    const lastElementRef = useRef<HTMLElement>(null);
    const { ref, entry } = useIntersection({
        root: lastElementRef.current,
        threshold: 1
    })

    useEffect(()=>{
        if(state === 1 && entry?.isIntersecting ) {
            //setPageQuotes(pageQuotes + 1);
            getQ();
        }
        if(state === 0 && entry?.isIntersecting ){
            getP();
        } 
    },[entry])

  return (
    <>
        <div  className='flex gap-2 mt-1'>
            <button
                onClick={() => startTransition(() => getP())} 
                disabled={isPending}
                className='text-text bg-secondary w-full py-2 pb-3 rounded-lg border-2 border-primary hover:text-primary text-xl'>posts</button>
            <button 
                onClick={() => {if(state !== 1) startTransition(() => getQ())}}
                disabled={isPending}
                className='text-text bg-secondary w-full py-2 pb-3 rounded-lg border-2 border-primary hover:text-primary text-xl '>quotes</button>
        </div>
        {state===0 && <Posts posts={posts} setPosts={setPosts}/>}
        {state===1 && <Quotes quotes={quotes}/>}
        <div ref={ref} className='h-1'></div>
        {isFetching && <div className='mx-auto mt-2 h-16 w-16 animate-spin rounded-full border-t border-accent'></div>}
    </>
  )
}


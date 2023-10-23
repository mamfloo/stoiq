import PostCard from '@/app/(components)/(card)/PostCard';
import { authOptions } from '@/lib/auth'
import { getErrorMessage } from '@/lib/errorToString';
import Account from '@/models/Account';
import Post, { Posts } from '@/models/Post';
import { getServerSession } from 'next-auth'
import Image from "next/image"
import Link from 'next/link';
import { AiOutlineCalendar } from "react-icons/Ai"
import { TbEdit } from "react-icons/tb"

export default async function page({params}: {params: {username: string}} ) {
    let isSameUser = false;

    const session = await getServerSession(authOptions);
    let user;
    if(session?.user.username === params.username){
      user = session.user
      isSameUser = true;
    } else {
      const u = await getUser(params.username);
      user = {
        username: u.username,
        profilePic: u.profilePic,
        bio: u.bio,
        registerDate: u.registerDate.toLocaleDateString()
      }
    }
    const posts = await getPosts(params.username);
    
  return (
    <div>
      <div className='flex gap-3 rounded-lg border-accent border-2 mb-2 p-3'>
        <Image className='rounded-full border-2 border-primary' 
          src={'/img/avatars/' + user.profilePic} alt={'avatar image stoiq'} height={100} width={100}/>
        <div className='flex flex-col gap-1 justify-center'>
          <p className='text-primary font-semibold text-lg flex'>@{user.username} <Link className='mt-1 ml-1 text-white' href={"/settings"}>{isSameUser && <TbEdit/>}</Link></p>
          <p>{user.bio}</p>
          <div className='flex'>
            <div className='mt-1'><AiOutlineCalendar size={"1.1em"} /></div> <p className='ml-1'> Joined {user.registerDate}</p>
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-2'>
        {Array.isArray(posts) && posts.map((p, i) => (
            <PostCard key={i} post={p as Posts}/>
          ))}
      </div>
    </div>
  )
}

async function getUser(username: string){
  try {
    const doc = await Account.findOne({username: username}).exec();
    if(doc === null){
      throw Error("No user was found");
    }
    return doc;
  } catch(e){
    return {
      errors: getErrorMessage(e)
  }
  }
  
}

async function getPosts(username: string) {
  try{
    const res: Posts[] = await Post.find({"author.username": username}, {author: {_id: 0}}).sort({postTime: -1}).lean();
    return res.map(r => (
        {
            ...r,
            _id: r._id.toString()
        }
    ));
  } catch (e){
    return {
        errors: getErrorMessage(e)
    }
  }
}

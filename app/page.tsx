import QuoteCard from './(components)/(quoteCard)/QuoteCard';
import Quote, { Quotes } from '@/models/Quote';
import dbConnect from '@/lib/mongo/connect';
import NewPost from './(components)/(newPost)/NewPost';
import Login from './(components)/(loginPopUp)/Login';
import Register from './(components)/(registerPopUp)/Register';

export default async function Home() {
  const quotes = await getQuotes();

  return (
    <div className=''>
      <NewPost />
      <div className="flex flex-col gap-3 mt-5">
        {quotes.map((q, i) => (
          <QuoteCard key={i} quote={{
            author: q.author,
            quote: q.quote,
            likedBy: q.likedBy,
            savedBy: q.savedBy
          }} />
        ))} 
      </div>
    </div>
    
  )
}

async function getQuotes(){
  try {
    await dbConnect();
    const res: Quotes[] = await Quote.find().limit(10);
    return res;
  } catch(e) {
    throw new Error("There was a problem fetching quotes");
  }
}
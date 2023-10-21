
import dbConnect from '@/lib/mongo/connect';
import PostQuotesSelector from './(components)/(postQuotesSelector)/PostQuotesSelector';

export default async function Home() {
  await dbConnect();

/*   const session = await getServerSession(authOptions)
  console.log(session) */


  return (
    <div className=''>
      <PostQuotesSelector/>
    </div>
    
  )
}

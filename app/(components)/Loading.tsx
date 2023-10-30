export default function Loading() {
    const array = Array.from({length: 10}, (x,i) => i)

  return (
    <div className='w-full h-full flex flex-col gap-3 animate-pulse'>
        { array.map(i => (
            <div key={i} className='flex h-28 rounded-lg  gap-2 bg-secondary'>
                <div className='w-14 h-14 bg-slate-700/[0.2] rounded-full mt-5 ml-3'>
                </div>
                <div className='flex flex-col gap-2 w-fit mt-5 '>
                    <div className='w-20 h-5 bg-slate-700/[0.2]'></div>
                    <div className='w-72 h-5 bg-slate-700/[0.2]'></div>
                    <div className="flex gap-4">
                        <div className='w-24 h-5 bg-slate-700/[0.2]'></div>
                        <div className='w-24 h-5 bg-slate-700/[0.2]'></div>
                    </div>
                </div>
            </div>
        ))

        }
    </div>
  )
}

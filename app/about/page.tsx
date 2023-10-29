import React from 'react'

export default function page() {
  return (
    <div>
        <h1 className='text-3xl text-primary mb-2 text-center mt-5'>About <p className='font-bold inline-block'>stoiq</p></h1>

        <div className='border-2 border-primary px-5 py-3 pb-5 text-center mt-10 rounded-lg'>
            <h2 className='text-2xl text-primary'>What is?</h2>
            <p>At stoiq, our mission is to create an enriched platform for individuals seeking profound insights from the wisdom of the greatest Stoics and a space for sharing their personal reflections. We are dedicated to enhancing the experience of reading quotes and fostering a community of great minds.</p>
        </div>

        <div className='border-2 border-primary px-5 py-3 pb-5 text-center mt-10 rounded-lg'>
            <h2 className='text-2xl text-primary'>Why?</h2>
            <p>Because there is no other patform that is made only for the people like us.</p>
        </div>

    </div>
  )
}

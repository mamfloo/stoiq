import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import React from 'react'

export default function page({params}: {params: {username: string}} ) {

    const session = getServerSession(authOptions);
    
  return (
    <div>

    </div>
  )
}

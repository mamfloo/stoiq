import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export const useRedirectIfAuthed = (path: string) => {
  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session.status !== 'authenticated') return
    router.push(path)
  }, [path, router, session.status])
}

export const useRedirectIfUnauthed = (path: string) => {
  const router = useRouter()
  const session = useSession({
    required: true,
    onUnauthenticated() {
      router.push(path)
    },
  })
}
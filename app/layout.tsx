import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from './(components)/navbar/Navbar'
import { Toaster } from 'react-hot-toast'
import { SessionProvider } from 'next-auth/react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'stoiq',
  description: 'made with love by mamflo',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="mx-auto bg-background text-text md:w-[600px]">
        <Navbar />
        <div className='p-5'>

          {children}

          <Toaster position='top-right' toastOptions={{
            style: {
              background: "#171717",
              color: "#ffffff",
              borderColor: "#a7a7a7",
              border: "2px solid"
            }
          }}/>
        </div>
        </body>
    </html>
  )
}

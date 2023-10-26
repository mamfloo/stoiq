import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from './(components)/navbar/Navbar'
import { Toaster } from 'react-hot-toast'
import Settings from './(components)/(layout)/Settings'
import Footer from './(components)/(layout)/Footer'

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
      <body className="mx-auto bg-background text-text flex justify-center md:mt-3 shrink grow">
        <div className='w-36 hidden md:block relative mr-6'>
          <div className='fixed w-36 flex justify-end'>
            <Settings />
          </div>
        </div>

        <div className='max-w-xl shrink grow'>
          <div className='md:hidden sticky top-0 right-0 left-0'>
            <Navbar/>
          </div>
          <div className='p-3'>
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
        </div>

        <div className='ml-4 max-w-xs w-max hidden lg:block relative grow shrink '>
          <div className='fixed h-max'>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  )
}

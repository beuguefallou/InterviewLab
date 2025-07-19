import { isAuthenticated } from '@/lib/actions/auth.action'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ReactNode } from 'react'
import LogoutButton from '@/components/LogoutButton'

const RootLayout = async ({children}: {children: ReactNode}) => {
  const isUserAuthenticated = await isAuthenticated();

  if(!isUserAuthenticated) redirect('/sign-in');

  return (
    <>
      <div className='root-layout'>
          <nav className='flex'>
            <Link href='/' className='flex items-center gap-2'>
              <Image src="/logo.svg" alt='Logo' width={38} height={32}/>
              <h2 className='text-primary-100'>Lakshya</h2>
            </Link>
            <div className="flex-grow" />
            <LogoutButton/>
          </nav>
      {children}
      </div>
      </>
  )
}

export default RootLayout
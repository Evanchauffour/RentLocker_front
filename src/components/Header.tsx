import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

export default function Header() {
  return (
   <header className='flex flex-row justify-between items-center py-4 px-8 w-full bg-slate-100'>
      <Link href="/">
        <Image src="/logo.png" alt="logo" width={70} height={70} />
      </Link>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
   </header>
  )
}

"use client"

import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/stores/userStore'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const { user, clearUser, isAuthenticated } = useUserStore()

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
      clearUser()
      router.push('/sign-in')
      setIsMenuOpen(false)
    } catch (error) {
      console.error(error)
    }
  }

  return (
   <header className='flex flex-row justify-between items-center py-4 px-8 w-full bg-slate-100 relative'>
      <Link href="/">
        <Image src="/logo.png" alt="logo" width={70} height={70} />
      </Link>
      <div className="relative">
        {isAuthenticated ? (
          <>
            <Avatar 
              className="cursor-pointer size-10" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>
                {user ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` : 'U'}
              </AvatarFallback>
            </Avatar>
            
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg p-1 z-50 border">
                <Link href="/profile">
                  <Button
                    variant="ghost"
                    className="w-full flex justify-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mon profil
                  </Button>
                </Link>
                {user?.role === 'admin' && (
                <Link href="/administration">
                  <Button
                    variant="ghost"
                    className="w-full flex justify-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    onClick={() => setIsMenuOpen(false)}
                  >
                      Administration
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  className="w-full flex justify-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={handleLogout}
                >
                  Se déconnecter
                </Button>
              </div>
            )}
          </>
        ) : (
          <Link href="/sign-in">
            <Button variant="outline">Se connecter</Button>
          </Link>
        )}
      </div>
   </header>
  )
}

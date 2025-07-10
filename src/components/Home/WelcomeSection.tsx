"use client"

import { useUserStore } from '@/stores/userStore'
import React from 'react'

export default function WelcomeSection() {
  const { user } = useUserStore()

  return (
    <>
    {user && (
      <div className="col-span-full mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Bienvenue, {user?.firstName} {user?.lastName} !
        </h1>
        <p className="text-gray-600">Gérez vos casiers et consultez votre historique</p>
      </div>
    )}
    </>
  )
}

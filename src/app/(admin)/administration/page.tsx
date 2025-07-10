import React from 'react'
import LockersTable from '@/components/Admin/LockersTable'

export interface Locker {
  _id: string
  name: string
  colNumber: number
  rowNumber: number
  size: string
  price: number
}

async function getLockers (): Promise<Locker[]> {
  try {
    const response = await fetch('http://localhost:8000/api/lockers', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error('Failed to fetch lockers')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching lockers:', error)
    return []
  }
}

export default async function page() {
  const lockers = await getLockers()
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestion des Casiers</h1>
      </div>
      <LockersTable lockers={lockers} />
    </div>
  )
}

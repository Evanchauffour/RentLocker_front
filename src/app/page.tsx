import React from 'react'
import LockersTable from '@/components/Admin/LockersTable'
import WelcomeSection from '@/components/Home/WelcomeSection'
import { Locker } from './(admin)/administration/page'
import HomeFilters from '@/components/Home/HomeFilters'
import { Card } from '@/components/ui/card'

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

export default async function Page() {
  const lockers = await getLockers()
  return (
    <main className='mx-8'>
       <WelcomeSection />

      <Card className='flex flex-col gap-4 p-4'>
        <HomeFilters />
        <LockersTable lockers={lockers} />
      </Card>
    </main>
  )
}

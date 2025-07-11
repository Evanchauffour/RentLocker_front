import React from 'react'
import LockersTable from '@/components/Admin/LockersTable'
import WelcomeSection from '@/components/Home/WelcomeSection'
import { Locker } from './(admin)/administration/page'
import HomeFilters from '@/components/Home/HomeFilters'
import { Card } from '@/components/ui/card'

async function getLockers (startDate: string, endDate: string): Promise<Locker[]> {
  try {
    const response = await fetch(`http://localhost:8000/api/lockers?startDate=${startDate}&endDate=${endDate}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    })

    console.log(response);

    if (!response.ok) {
      throw new Error('Failed to fetch lockers')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching lockers:', error)
    return []
  }
}

export default async function Page({ searchParams }: { searchParams: Promise<{ startDate?: string, endDate?: string }> }) {
  const params = await searchParams
  const lockers = await getLockers(params.startDate || '', params.endDate || '')  

  console.log(lockers);

  return (
    <main className='mx-8'>
       <WelcomeSection />

      <Card className='flex flex-col gap-4 p-4'>
        <HomeFilters />
        <LockersTable lockers={lockers} isInAdmin={false} />
      </Card>
    </main>
  )
}

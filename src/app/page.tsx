import React from 'react'
import LockersTable from '@/components/Admin/LockersTable'
import WelcomeSection from '@/components/Home/WelcomeSection'
import { Locker } from './(admin)/administration/page'
import HomeFilters from '@/components/Home/HomeFilters'
import { Card } from '@/components/ui/card'

async function getLockers (
  startDate: string, 
  endDate: string,
  priceSort?: string,
  size?: string,
  availability?: string
): Promise<Locker[]> {
  if (startDate === '' || endDate === '') {
    return []
  }

  try {
    const params = new URLSearchParams({
      startDate,
      endDate
    })

    // Ajouter les filtres à l'URL si ils sont définis
    if (priceSort && priceSort !== 'all') {
      params.append('priceSort', priceSort)
    }
    if (size && size !== 'all') {
      params.append('size', size)
    }
    if (availability && availability !== 'all') {
      params.append('availability', availability)
    }

    const response = await fetch(`http://localhost:8000/api/lockers?${params.toString()}`, {
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

export default async function Page({ searchParams }: { searchParams: Promise<{ 
  startDate?: string, 
  endDate?: string,
  priceSort?: string,
  size?: string,
  availability?: string
}> }) {
  const params = await searchParams
  const lockers = await getLockers(
    params.startDate || '', 
    params.endDate || '',
    params.priceSort,
    params.size,
    params.availability
  )

  return (
    <main className='mx-8'>
       <WelcomeSection />

      <Card className='flex flex-col gap-4 p-4'>
        <HomeFilters />
        {lockers.length > 0 ? (
          <LockersTable lockers={lockers} isInAdmin={false} />
        ) : params.startDate && params.endDate ? (
          <div className='flex flex-col items-center justify-center gap-4 p-4 bg-gray-100 rounded-lg shadow-md'>
            <p className='text-lg font-semibold text-gray-700'>Aucun casier disponible pour les critères sélectionnés.</p>
            <p className='text-sm text-gray-500'>Essayez de modifier vos filtres pour voir d&apos;autres options.</p>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center gap-4 p-4 bg-gray-100 rounded-lg shadow-md'>
            <p className='text-lg font-semibold text-gray-700'>Veuillez sélectionner une date de début et une date de fin.</p>
            <p className='text-sm text-gray-500'>Utilisez les filtres ci-dessus pour commencer votre recherche.</p>
          </div>
        )}
      </Card>
    </main>
  )
}

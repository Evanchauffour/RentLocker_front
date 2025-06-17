import { Card, CardHeader, CardContent } from '@/components/ui/card'
import React from 'react'
import { Lock, History } from 'lucide-react'
import { Button } from '@/components/ui/button'
import RentLocker from '@/components/Home/RentLocker'

export default function page() {
  const currentLockers = [
    {
      id: 1,
      name: 'Casier 1',
      dateExpiration: '2024-12-31'
    },
    {
      id: 2,
      name: 'Casier 2',
      dateExpiration: '2024-11-30'
    },
    {
      id: 3,
      name: 'Casier 3',
      dateExpiration: '2024-10-31'
    }
  ]

  const lockerHistory = [
    {
      id: 1,
      name: 'Casier 1',
      date: '2024-03-15',
      expirationDate: '2024-03-15',
      price: 29.99
    },
    {
      id: 2,
      name: 'Casier 2',
      date: '2024-03-10',
      expirationDate: '2024-03-10',
      price: 24.99
    },
    {
      id: 3,
      name: 'Casier 3',
      date: '2024-03-05',
      expirationDate: '2024-03-05',
      price: 19.99
    }
  ]

  return (
    <main className='mx-8 grid grid-cols-1 md:grid-cols-2 gap-8'>
      <Card>
        <CardHeader className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Lock className="w-5 h-5 text-blue-500" />
            <span>Casiers actifs</span>
          </div>
          <Button variant="outline">
            Voir tout
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentLockers.map((locker) => (
              <Card key={locker.id} className="p-3 flex flex-row justify-between items-center h-[80px]">
                <div className='flex flex-col gap-2'>
                  <h3 className="font-semibold text-base">{locker.name}</h3>
                  <p className="text-sm text-gray-600">Date d&apos;expiration: {locker.dateExpiration}</p>
                </div>
                <Button variant="outline">Renouveler</Button>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <History className="w-5 h-5 text-purple-500" />
            <span>Historique des casiers</span>
          </div>
          <Button variant="outline">
            Voir tout
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {lockerHistory.map((locker) => (
              <Card key={locker.id} className="p-3 flex flex-col gap-2 h-[80px]">
                <h3 className="font-semibold text-base">{locker.name}</h3>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{locker.date} - {locker.expirationDate}</span>
                  <span>{locker.price.toFixed(2)} €</span>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      <RentLocker />
    </main>
  )
}

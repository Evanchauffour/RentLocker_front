'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { DatePicker } from '../ui/datePicker'
import dayjs from 'dayjs'

interface Locker {
  _id: string
  id: number
  name: string
  colNumber: string
  rowNumber: string
  size: string
  price: number
  isAvailable: boolean
}

interface LockerGrid {
  nbColumns: number
  nbRows: number
}
export default function RentLocker() {
  const [lockers, setLockers] = useState<Locker[]>([])
  const [lockerGrid, setLockerGrid] = useState<LockerGrid>()
  const [startDate, setStartDate] = useState<Date>(dayjs().toDate())
  const [endDate, setEndDate] = useState<Date>(dayjs().add(1, 'day').toDate())

  const handleStartDateChange = (date: Date | undefined) => {
    if (date) setStartDate(date)
  }

  const handleEndDateChange = (date: Date | undefined) => {
    if (date) setEndDate(date)
  }

  useEffect(() => {
    const fetchLockers = async () => {
      const res = await fetch(`http://localhost:8000/api/lockers?startDate=${startDate}&endDate=${endDate}`)
      const data = await res.json()
      setLockers(data)
    }

    const fetchLockerGrid = async () => {
      const res = await fetch('http://localhost:8000/api/locker-grid')
      const data = await res.json()
      setLockerGrid(data[0])
    }

    fetchLockers()
    fetchLockerGrid()
  }, [endDate, startDate])

  return (
    <Card className='col-span-2'>
    <CardHeader>
      <CardTitle className='mb-4'>
        <h1>Réserver un casier</h1>
      </CardTitle>
      <div className="flex gap-2">
        <DatePicker 
          label="Date de début" 
          initialDate={startDate} 
          onDateChange={handleStartDateChange}
        />
        <DatePicker 
          label="Date de fin" 
          initialDate={endDate} 
          onDateChange={handleEndDateChange}
        />
      </div>
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto">
        <div className="grid gap-4 min-w-max" style={{
          gridTemplateColumns: `repeat(${lockerGrid?.nbColumns || 1}, minmax(200px, 1fr))`,
          gridTemplateRows: `repeat(${lockerGrid?.nbRows || 1}, minmax(0, 1fr))`
        }}>
          {lockers.map((locker) => (
            <Card 
              key={locker._id} 
              className="w-full h-full min-w-[200px]"
              style={{
                gridColumn: locker.colNumber,
                gridRow: locker.rowNumber
              }}
            >
              <CardHeader>
                <CardTitle>{locker.name}</CardTitle>
                <CardDescription>{locker.size} - {locker.price}€</CardDescription>
                <Button disabled={!locker.isAvailable}>Réserver</Button>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
  )
}

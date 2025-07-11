"use client"

import dayjs from 'dayjs'
import React, { useState } from 'react'
import { DatePicker } from '../ui/datePicker'
import { useRouter, useSearchParams } from 'next/navigation'

export default function HomeFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [startDate, setStartDate] = useState<Date>(dayjs().toDate())
  const [endDate, setEndDate] = useState<Date>(dayjs().add(1, 'day').toDate())

  const handleStartDateChange = (date: Date | undefined) => {    
    if (date) {
      setStartDate(date)
      if (date > endDate) {
        setEndDate(date)
        const params = new URLSearchParams(searchParams)
        params.set('endDate', dayjs(date).format('YYYY-MM-DD'))
        router.push(`/?${params.toString()}`, { scroll: false })
      }
      const params = new URLSearchParams(searchParams)
      params.set('startDate', dayjs(date).format('YYYY-MM-DD'))
      router.push(`/?${params.toString()}`, { scroll: false })
    }
  }

  const handleEndDateChange = (date: Date | undefined) => {
    if (date) {
      setEndDate(date)
      if (date < startDate) {
        setStartDate(date)
        const params = new URLSearchParams(searchParams)
        params.set('startDate', dayjs(date).format('YYYY-MM-DD'))
        router.push(`/?${params.toString()}`, { scroll: false })
      }
      const params = new URLSearchParams(searchParams)
      params.set('endDate', dayjs(date).format('YYYY-MM-DD'))
      router.push(`/?${params.toString()}`, { scroll: false })
    }
  }

  return (
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
  )
}

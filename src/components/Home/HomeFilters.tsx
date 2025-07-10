"use client"

import dayjs from 'dayjs'
import React, { useState } from 'react'
import { DatePicker } from '../ui/datePicker'

export default function HomeFilters() {
  const [startDate, setStartDate] = useState<Date>(dayjs().toDate())
  const [endDate, setEndDate] = useState<Date>(dayjs().add(1, 'day').toDate())

  const handleStartDateChange = (date: Date | undefined) => {
    if (date) setStartDate(date)
  }

  const handleEndDateChange = (date: Date | undefined) => {
    if (date) setEndDate(date)
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

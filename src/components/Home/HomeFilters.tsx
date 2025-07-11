"use client"

import dayjs from 'dayjs'
import React, { useState } from 'react'
import { DatePicker } from '../ui/datePicker'
import { useRouter, useSearchParams } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Label } from '../ui/label'

export default function HomeFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)

  const handleStartDateChange = (date: Date | undefined) => {    
    setStartDate(date)
    const params = new URLSearchParams(searchParams)
    
    if (date) {
      if (endDate && date > endDate) {
        setEndDate(date)
        params.set('endDate', dayjs(date).format('YYYY-MM-DD'))
      }
      params.set('startDate', dayjs(date).format('YYYY-MM-DD'))
    } else {
      params.delete('startDate')
    }
    
    router.push(`/?${params.toString()}`, { scroll: false })
  }

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date)
    const params = new URLSearchParams(searchParams)
    
    if (date) {
      if (startDate && date < startDate) {
        setStartDate(date)
        params.set('startDate', dayjs(date).format('YYYY-MM-DD'))
      }
      params.set('endDate', dayjs(date).format('YYYY-MM-DD'))
    } else {
      params.delete('endDate')
    }
    
    router.push(`/?${params.toString()}`, { scroll: false })
  }

  const handleFilterChange = (filterType: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    
    if (value && value !== 'all') {
      params.set(filterType, value)
    } else {
      params.delete(filterType)
    }
    
    router.push(`/?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <DatePicker
          label="Date de début" 
          placeholder="Sélectionner une date de début"
          initialDate={startDate} 
          onDateChange={handleStartDateChange}
        />
        <DatePicker 
          label="Date de fin" 
          placeholder="Sélectionner une date de fin"
          initialDate={endDate} 
          onDateChange={handleEndDateChange}
        />
      </div>
      
      <div className="flex gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="price-sort">Trier par prix</Label>
          <Select 
            value={searchParams.get('priceSort') || 'all'} 
            onValueChange={(value) => handleFilterChange('priceSort', value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trier par prix" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="asc">Prix croissant</SelectItem>
              <SelectItem value="desc">Prix décroissant</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="size-filter">Taille</Label>
          <Select 
            value={searchParams.get('size') || 'all'} 
            onValueChange={(value) => handleFilterChange('size', value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par taille" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les tailles</SelectItem>
              <SelectItem value="S">Petit (S)</SelectItem>
              <SelectItem value="M">Moyen (M)</SelectItem>
              <SelectItem value="L">Grand (L)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="availability-filter">Disponibilité</Label>
          <Select 
            value={searchParams.get('availability') || 'all'} 
            onValueChange={(value) => handleFilterChange('availability', value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par disponibilité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="available">Disponible</SelectItem>
              <SelectItem value="unavailable">Indisponible</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

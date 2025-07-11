"use client"

import React, { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DatePicker } from '../ui/datePicker'
import dayjs from 'dayjs'
import { createReservation } from '@/actions/reservations'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { Locker } from '@/app/(admin)/administration/page'

export default function BookLockerDialog({ isOpen = false, onOpenChange, startDate, endDate, locker }: { isOpen: boolean, onOpenChange: (open: boolean) => void, startDate: string, endDate: string, locker: Locker | null }) {
  const [loading, setLoading] = useState(false)
  const [selectedStartDate, setSelectedStartDate] = useState<Date>(dayjs(startDate).toDate())
  const [selectedEndDate, setSelectedEndDate] = useState<Date>(dayjs(endDate).toDate())
  const router = useRouter()

  // Réinitialiser les dates sélectionnées quand le locker change
  React.useEffect(() => {
    if (locker) {
      setSelectedStartDate(dayjs(startDate).toDate())
      setSelectedEndDate(dayjs(endDate).toDate())
    }
  }, [locker, startDate, endDate])

  const numberOfDays = useMemo(() => {
    const diffTime = Math.abs(selectedEndDate.getTime() - selectedStartDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }, [selectedStartDate, selectedEndDate])

  const totalPrice = useMemo(() => {
    if (locker?.price === null || locker?.price === undefined) return 0
    return locker.price * numberOfDays
  }, [locker?.price, numberOfDays])

  // Les dates sont toujours fixes pour les casiers disponibles
  const fromDate = undefined
  const toDate = undefined

  const handleReserve = async () => {
    if (!locker) return
    try {
      setLoading(true)
      await createReservation(locker._id, dayjs(selectedStartDate).format('YYYY-MM-DD'), dayjs(selectedEndDate).format('YYYY-MM-DD'))
      toast.success('Réservation créée avec succès')
      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.log(error);
      toast.error('Erreur lors de la réservation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Réserver un casier</DialogTitle>
          <DialogDescription>
            Confirmez votre réservation pour les dates sélectionnées.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleReserve}>
          <div className="grid gap-4 py-4">
            <DatePicker
              label="Date de début" 
              initialDate={selectedStartDate} 
              onDateChange={(date) => date && setSelectedStartDate(date)}
              fromDate={fromDate}
              toDate={toDate}
              disabled={true}
            />
            <DatePicker 
              label="Date de fin" 
              initialDate={selectedEndDate} 
              onDateChange={(date) => date && setSelectedEndDate(date)}
              fromDate={selectedStartDate}
              toDate={toDate}
              disabled={true}
            />
            <div className="flex flex-col gap-2">
              <Label htmlFor="price" className="text-right">
                Prix total (€)
              </Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.5"
                value={totalPrice.toFixed(2)}
                className="col-span-3"
                disabled
              />
            </div>
            <div className="text-sm text-gray-500 text-center">
              {numberOfDays} jour(s) x {locker?.price}€/jour = {totalPrice.toFixed(2)}€
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Réservation...' : 'Réserver'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 
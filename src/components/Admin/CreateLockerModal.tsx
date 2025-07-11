"use client"

import React, { useEffect, useState } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createLocker, updateLocker } from '@/actions/lockers'
import { useRouter } from 'next/navigation'
import { Locker } from '@/app/(admin)/administration/page'

export default function CreateLockerModal({ isOpen = false, onOpenChange, isUpdate = false, locker }: { isOpen: boolean, onOpenChange: (open: boolean) => void, isUpdate: boolean, locker: Locker | null }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [formData, setFormData] = useState({
    _id: locker?._id || '',
    name: locker?.name || '',
    colNumber: locker?.colNumber || 1,
    rowNumber: locker?.rowNumber || 1,
    size: locker?.size || 'S',
    price: locker?.price || 5
  })
  
  useEffect(() => {
    if (isUpdate) {
      setFormData({
        _id: locker?._id || '',
        name: locker?.name || '',
        colNumber: locker?.colNumber || 1,
        rowNumber: locker?.rowNumber || 1,
        size: locker?.size || 'S',
        price: locker?.price || 5
      })
    }
  }, [locker, isUpdate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      if (isUpdate) {
        await updateLocker(formData)
      } else {
        await createLocker(formData)
      }
      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
      setFormData({
        _id: '',
        name: '',
        colNumber: 1,
        rowNumber: 1,
        size: 'S',
        price: 5
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isUpdate ? 'Modifier un casier' : 'Créer un nouveau casier'}</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour {isUpdate ? 'modifier' : 'créer'} le casier.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nom
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="colNumber" className="text-right">
                Colonne
              </Label>
              <Input
                id="colNumber"
                type="number"
                min="1"
                value={formData.colNumber}
                onChange={(e) => setFormData({ ...formData, colNumber: parseInt(e.target.value) })}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rowNumber" className="text-right">
                Rangée
              </Label>
              <Input
                id="rowNumber"
                type="number"
                min="1"
                value={formData.rowNumber}
                onChange={(e) => setFormData({ ...formData, rowNumber: parseInt(e.target.value) })}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="size" className="text-right">
                Taille
              </Label>
              <Select
                value={formData.size}
                onValueChange={(value: string) => setFormData({ ...formData, size: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner une taille" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="S">Petit (S)</SelectItem>
                  <SelectItem value="M">Moyen (M)</SelectItem>
                  <SelectItem value="L">Grand (L)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Prix (€)
              </Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.5"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Création...' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 
"use client"

import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Edit, Trash2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Locker } from '@/app/(admin)/administration/page'
import { deleteLocker } from '@/actions/lockers'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'react-toastify'
import CreateLockerModal from './CreateLockerModal'
import BookLockerDialog from '../Home/BookLockerDialog'

interface LockersTableProps {
  lockers: Locker[]
  isInAdmin?: boolean
}

export default function LockersTable({ lockers, isInAdmin = false }: LockersTableProps) {
  const searchParams = useSearchParams()
  const startDate = searchParams.get('startDate') || ''
  const endDate = searchParams.get('endDate') || ''
  const [isOpen, setIsOpen] = useState(false)
  const [isBookOpen, setIsBookOpen] = useState(false)
  const [lockerToBook, setLockerToBook] = useState<Locker | null>(null)
  const router = useRouter()
  const [lockerToEdit, setLockerToEdit] = useState<Locker | null>(null)

  const handleEdit = (locker: Locker) => {
    setLockerToEdit(locker)
    setIsOpen(true)
  }

  const handleCreate = () => {
    setLockerToEdit(null)
    setIsOpen(true)
  }

  const handleDelete = async (locker: Locker) => {
    try {
      await deleteLocker(locker._id)
      toast.success('Casier supprimé avec succès')
      router.refresh()
    } catch (error) {
      console.log(error);
      toast.error('Erreur lors de la suppression du casier')
    }
  }

  return (
    <div className="w-full flex flex-col items-end gap-4">
      {isInAdmin && (
        <Button onClick={() => handleCreate()} className='w-fit'><Plus className="mr-2 h-4 w-4" /> Créer un casier</Button>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Colonne</TableHead>
            <TableHead>Rangée</TableHead>
            <TableHead>Taille</TableHead>
            <TableHead>Prix (€) / jour</TableHead>
            <TableHead>Disponibilité</TableHead>
            {isInAdmin && (
              <TableHead className="w-[50px]"></TableHead>
            )}
            {!isInAdmin && (
              <TableHead className="w-[100px]"></TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {lockers.map((locker) => (
            <TableRow key={locker._id} className={locker.availability && (locker.availability.status === 'unavailable' ? 'opacity-50' : '')}>
              <TableCell className="font-medium">{locker.name}</TableCell>
              <TableCell>{locker.colNumber}</TableCell>
              <TableCell>{locker.rowNumber}</TableCell>
              <TableCell>{locker.size}</TableCell>
              <TableCell>{locker.price}€</TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      locker.availability?.status === 'available' ? 'bg-green-500' :
                      locker.availability?.status === 'partially_available' ? 'bg-yellow-500' :
                      locker.availability?.status === 'unavailable' ? 'bg-red-500' : 'bg-gray-300'
                    }`}></div>
                    <span className={`text-sm font-medium ${
                      locker.availability?.status === 'available' ? 'text-green-700' :
                      locker.availability?.status === 'partially_available' ? 'text-yellow-700' :
                      locker.availability?.status === 'unavailable' ? 'text-red-700' : 'text-gray-500'
                    }`}>
                      {locker.availability?.status === 'available' ? 'Disponible' :
                       locker.availability?.status === 'partially_available' ? 'Partiellement' :
                       locker.availability?.status === 'unavailable' ? 'Indisponible' : 'Inconnu'}
                    </span>
                  </div>
                  {locker.availability?.status === 'partially_available' && locker.availability?.nextAvailableDate && (
                    <div className="text-xs text-gray-500 ml-5">
                      Prochaine disponibilité: {new Date(locker.availability.nextAvailableDate).toLocaleDateString('fr-FR')}
                    </div>
                  )}
                  {locker.availability?.status === 'unavailable' && locker.availability?.nextAvailableDate && (
                    <div className="text-xs text-gray-500 ml-5">
                      Prochaine disponibilité: {new Date(locker.availability.nextAvailableDate).toLocaleDateString('fr-FR')}
                    </div>
                  )}
                </div>
              </TableCell>
              {isInAdmin && (
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Ouvrir le menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(locker)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(locker)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              )}
              {!isInAdmin && (
                <TableCell>
                  <Button 
                    variant="outline" 
                    disabled={locker.availability.status === 'unavailable' || locker.availability.status === 'partially_available'} 
                    onClick={() => {
                      setLockerToBook(locker)
                      setIsBookOpen(true)
                    }}
                  >
                    {locker.availability.status === 'partially_available' ? 'Indisponible' : 'Réserver'}
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <CreateLockerModal isOpen={isOpen} onOpenChange={setIsOpen} isUpdate={lockerToEdit !== null} locker={lockerToEdit} />
      <BookLockerDialog isOpen={isBookOpen} onOpenChange={setIsBookOpen} startDate={startDate} endDate={endDate} locker={lockerToBook || null} />
    </div>
  )
}

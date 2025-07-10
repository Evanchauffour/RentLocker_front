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
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import CreateLockerModal from './CreateLockerModal'
import { useUserStore } from '@/stores/userStore'

interface LockersTableProps {
  lockers: Locker[]
}

export default function LockersTable({ lockers }: LockersTableProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const [lockerToEdit, setLockerToEdit] = useState<Locker | null>(null)
  const { user } = useUserStore()

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
      {user?.role === 'admin' && (
        <Button onClick={() => handleCreate()} className='w-fit'><Plus className="mr-2 h-4 w-4" /> Créer un casier</Button>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Colonne</TableHead>
            <TableHead>Rangée</TableHead>
            <TableHead>Taille</TableHead>
            <TableHead>Prix (€)</TableHead>
            {user?.role === 'admin' && (
              <TableHead className="w-[50px]"></TableHead>
            )}
            {user?.role === 'user' && (
              <TableHead className="w-[100px]"></TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {lockers.map((locker) => (
            <TableRow key={locker._id}>
              <TableCell className="font-medium">{locker.name}</TableCell>
              <TableCell>{locker.colNumber}</TableCell>
              <TableCell>{locker.rowNumber}</TableCell>
              <TableCell>{locker.size}</TableCell>
              <TableCell>{locker.price}€</TableCell>
              {user?.role === 'admin' && (
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Ouvrir le menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  {user?.role === 'admin' && (
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
                  )}
                </DropdownMenu>
              </TableCell>
              )}
              {user?.role === 'user' && (
                <TableCell>
                  <Button variant="outline">Réserver</Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <CreateLockerModal isOpen={isOpen} onOpenChange={setIsOpen} isUpdate={lockerToEdit !== null} locker={lockerToEdit} />
    </div>
  )
}

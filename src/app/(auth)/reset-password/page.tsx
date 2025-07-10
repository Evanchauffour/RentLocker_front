"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

type FormData = {
  newPassword: string
  confirmPassword: string
}

export default function ResetPasswordPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()
  const params = useSearchParams()
  const token = params.get('token')
  const router = useRouter()

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch('http://localhost:8000/api/auth/reset-password', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ token, newPassword: data.newPassword }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (res.ok) {
        toast.success('Mot de passe réinitialisé avec succès !')
        router.push('/sign-in')
      } else {
        const errorData = await res.json()
        toast.error(errorData.message || 'Erreur lors de la réinitialisation du mot de passe')
      }
    } catch (error) {
      toast.error('Erreur lors de la réinitialisation du mot de passe')
      console.log(error)
    }
  }

  return (
    <div className='w-full flex justify-center items-center my-auto h-screen'>
      <section className='flex flex-col w-full sm:w-[400px] justify-center'>
        <Card className='flex flex-col gap-4'>
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
            <CardHeader>
              <h1 className='text-4xl w-full text-center mb-6 text-text font-poppins font-bold'>
                Réinitialiser le mot de passe
              </h1>
            </CardHeader>
            <CardContent className='flex flex-col gap-4'>
              <div className='flex flex-col gap-2'>
                <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                <div>
                  <Input type="password" id="newPassword" {...register('newPassword', { required: "Le nouveau mot de passe est requis" })} />
                  {errors.newPassword && <p className='text-sm text-destructive'>{errors.newPassword.message}</p>}
                </div>
              </div>
              <div className='flex flex-col gap-2'>
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <div>
                  <Input type="password" id="confirmPassword" {...register('confirmPassword', { required: "La confirmation du mot de passe est requise" })} />
                  {errors.confirmPassword && <p className='text-sm text-destructive'>{errors.confirmPassword.message}</p>}
                </div>
              </div>
            </CardContent>
            <CardFooter className='flex flex-col gap-4'>
              <Button type="submit" className='w-full'>Réinitialiser le mot de passe</Button>
            </CardFooter>
          </form>
        </Card>
      </section>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  )
}

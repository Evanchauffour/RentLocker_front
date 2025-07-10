"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label' 
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

type FormData = {
  email: string
}

export default function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()
  const router = useRouter()

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch('http://localhost:8000/api/auth/forgot-password', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (res.ok) {
        toast.success('Lien de réinitialisation envoyé avec succès !')
        router.push('/sign-in')
      } else {
        const errorData = await res.json()
        toast.error(errorData.message || 'Erreur lors de l\'envoi du lien de réinitialisation')
      }
    } catch (error) {
      toast.error('Erreur lors de l\'envoi du lien de réinitialisation')
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
                Mot de passe oublié
              </h1>
            </CardHeader>
            <CardContent className='flex flex-col gap-4'>
              <div className='flex flex-col gap-2'>
                <Label htmlFor="email">Email</Label>
                <div>
                  <Input type="email" id="email" {...register('email', { required: "L'email est requis" })} />
                  {errors.email && <p className='text-sm text-destructive'>{errors.email.message}</p>}
                </div>
              </div>
            </CardContent>
            <CardFooter className='flex flex-col gap-4'>
              <Button type="submit" className='w-full'>Envoyer le lien de réinitialisation</Button>
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

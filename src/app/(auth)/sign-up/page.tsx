"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useUserStore } from '@/stores/userStore'

type FormData = {
  firstName: string
  lastName: string
  email: string
  password: string
}

export default function SignUpPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()
  const router = useRouter()
  const { setUser } = useUserStore()

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (res.ok) {
        const userData = await res.json()
        setUser(userData.user)
        toast.success('Inscription réussie !')
        router.push('/')
      } else {
        const errorData = await res.json()
        toast.error(errorData.message || 'Erreur lors de l\'inscription')
      }
    } catch (error) {
      toast.error('Erreur lors de l\'inscription')
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
                S&apos;inscrire
              </h1>
            </CardHeader>
            <CardContent className='flex flex-col gap-4'>
              <div className='flex flex-col gap-2'>
                <Label htmlFor="firstName">Prénom</Label>
                <div>
                  <Input type="text" id="firstName" {...register('firstName', { required: "Le prénom est requis" })} />
                  {errors.firstName && <p className='text-sm text-destructive'>{errors.firstName.message}</p>}
                </div>
              </div>
              <div className='flex flex-col gap-2'>
                <Label htmlFor="lastName">Nom</Label>
                <div>
                  <Input type="text" id="lastName" {...register('lastName', { required: "Le nom est requis" })} />
                  {errors.lastName && <p className='text-sm text-destructive'>{errors.lastName.message}</p>}
                </div>
              </div>
              <div className='flex flex-col gap-2'>
                <Label htmlFor="email">Email</Label>
                <div>
                  <Input type="email" id="email" {...register('email', { required: "L'email est requis" })} />
                  {errors.email && <p className='text-sm text-destructive'>{errors.email.message}</p>}
                </div>
              </div>
              <div className='flex flex-col gap-2'>
                <Label htmlFor="password">Mot de passe</Label>
                <div>
                  <Input type="password" id="password" {...register('password', { required: "Le mot de passe est requis" })} />
                  {errors.password && <p className='text-sm text-destructive'>{errors.password.message}</p>}
                </div>
              </div>
            </CardContent>
            <CardFooter className='flex flex-col gap-4'>
              <Button type="submit" className='w-full'>S&apos;inscrire</Button>
              <p className='text-sm text-muted-foreground text-center'>
                Déjà un compte ? <Link href="/sign-in">Se connecter</Link>
              </p>
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

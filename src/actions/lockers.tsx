"use server"

import { cookies } from "next/headers"

interface CreateLocker {
  name: string
  colNumber: number
  rowNumber: number
  size: string
  price: number
}

interface UpdateLocker {
  _id: string
  name: string
  colNumber: number
  rowNumber: number
  size: string
  price: number
}

export async function createLocker (data: CreateLocker) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  try {
    const response = await fetch(`http://localhost:8000/api/lockers`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`    
      }
    })

    if (!response.ok) {
      throw new Error('Failed to create locker')
    }
  } catch (error) { 
    console.error('Error creating locker:', error)
    return { success: false, error: 'Failed to create locker' }
  }
}

export async function updateLocker (data: UpdateLocker) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  try {
    const response = await fetch(`http://localhost:8000/api/lockers/${data._id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`    
      }
    })

    if (!response.ok) {
      throw new Error('Failed to update locker')
    }

  } catch (error) { 
    console.error('Error updating locker:', error)
    return { success: false, error: 'Failed to update locker' }
  }
}

export async function deleteLocker (lockerId: string) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  try {
    const response = await fetch(`http://localhost:8000/api/lockers/${lockerId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`    
      }
    })    

    if (!response.ok) {
      throw new Error('Failed to delete locker')
    }

  } catch (error) { 
    console.error('Error deleting locker:', error)
    return { success: false, error: 'Failed to delete locker' }
  }
}
"use server"

import { cookies } from "next/headers"

export async function createReservation(lockerId: string, startDate: string, endDate: string) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  try {
    const response = await fetch(`http://localhost:8000/api/reservation`, {
      method: 'POST',
      body: JSON.stringify({ lockerId, startDate, endDate }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error('Failed to create reservation')
    }

  } catch (error) {
    console.error('Error creating reservation:', error)
    return { success: false, error: 'Failed to create reservation' }
  }
}
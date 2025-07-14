"use server";

import { cookies } from "next/headers";

export async function createReservation(
  lockerId: string,
  startDate: string,
  endDate: string
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      }/api/reservation`,
      {
        method: "POST",
        body: JSON.stringify({ lockerId, startDate, endDate }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create reservation");
    }

    return { success: true };
  } catch (error) {
    console.error("Error creating reservation:", error);
    return { success: false, error: "Failed to create reservation" };
  }
}

export async function getUserReservations() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return { success: false, error: "Authentication required" };
  }

  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      }/api/reservation/userLocks`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch reservations");
    }

    const reservations = await response.json();
    return { success: true, data: reservations };
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return { success: false, error: "Failed to fetch reservations" };
  }
}

export async function deleteReservation(reservationId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return { success: false, error: "Authentication required" };
  }

  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      }/api/reservation/userLocks/${reservationId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorMessage = `Erreur ${response.status}: Impossible d'annuler la réservation`;

      return { success: false, error: errorMessage };
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting reservation:", error);
    return { success: false, error: "Failed to delete reservation" };
  }
}

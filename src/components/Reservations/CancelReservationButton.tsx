"use client";

import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { deleteReservation } from "@/actions/reservations";

interface CancelReservationButtonProps {
  reservationId: string;
}

export default function CancelReservationButton({
  reservationId,
}: CancelReservationButtonProps) {
  const router = useRouter();

  const handleDeleteReservation = async () => {
    try {
      const { success, error } = await deleteReservation(reservationId);

      if (success) {
        toast.success("Réservation annulée avec succès");
        router.refresh();
      } else {
        toast.error(error || "Erreur lors de l'annulation");
      }
    } catch (error) {
      console.error("Erreur lors de l'annulation:", error);
      toast.error("Une erreur est survenue");
    }
  };

  return (
    <button
      onClick={handleDeleteReservation}
      className="mt-4 flex gap-2 items-center bg-red-600/80 p-2 rounded-full text-white font-semibold hover:cursor-pointer btn-hover-effect"
    >
      <Trash2 size={16} />
      Annuler la réservation
    </button>
  );
}

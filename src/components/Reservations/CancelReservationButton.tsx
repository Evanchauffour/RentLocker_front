"use client";

import { useState } from "react";
import { Trash2, AlertTriangle, X, Check } from "lucide-react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { deleteReservation } from "@/actions/reservations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CancelReservationButtonProps {
  reservationId: string;
}

export default function CancelReservationButton({
  reservationId,
}: CancelReservationButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDeleteReservation = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
      setShowConfirmation(false);
    }
  };

  if (showConfirmation) {
    return (
      <Card className="border-red-200 bg-red-50/50 shadow-soft animate-fadeIn">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-red-700 text-lg">
            <AlertTriangle className="h-5 w-5" />
            Confirmer l'annulation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-red-600">
            Êtes-vous sûr de vouloir annuler cette réservation ? Cette action est irréversible.
          </p>

          <div className="flex gap-3">
            <Button
              onClick={handleDeleteReservation}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 btn-hover-effect"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Annulation...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Confirmer
                </>
              )}
            </Button>

            <Button
              onClick={() => setShowConfirmation(false)}
              disabled={isLoading}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Annuler
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Button
      onClick={() => setShowConfirmation(true)}
      variant="outline"
      className="w-full border-red-200 text-red-600 hover:bg-red-100 hover:border-red-400 hover:text-red-700 transition-all duration-200 flex items-center gap-2 btn-hover-effect group"
    >
      <div className="bg-red-100 p-1 rounded-full group-hover:bg-red-300 transition-colors">
        <Trash2 className="h-4 w-4 text-red-600 group-hover:text-red-700" />
      </div>
      <span className="font-medium">Annuler la réservation</span>
    </Button>
  );
}

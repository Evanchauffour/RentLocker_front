"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import {
  getCheckoutSession,
  confirmReservationAfterPayment,
} from "@/actions/payments";
import { StripeCheckoutSession } from "@/types/payment";

export default function ReservationSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sessionDetails, setSessionDetails] =
    useState<StripeCheckoutSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reservationConfirmed, setReservationConfirmed] = useState(false);

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      router.push("/");
      return;
    }

    const processPayment = async () => {
      try {
        // Récupérer les détails de la session Stripe
        const sessionResult = await getCheckoutSession(sessionId);

        if (!sessionResult.success || !sessionResult.session) {
          throw new Error(
            sessionResult.error ||
              "Erreur lors de la récupération de la session"
          );
        }

        setSessionDetails(sessionResult.session);

        // Vérifier si le paiement a été effectué
        if (sessionResult.session.payment_status === "paid") {
          // Confirmer la réservation dans le backend
          const confirmResult = await confirmReservationAfterPayment(sessionId);

          if (confirmResult.success) {
            setReservationConfirmed(true);
          } else {
            // Si l'erreur indique que la réservation existe déjà, c'est OK
            if (
              confirmResult.error &&
              confirmResult.error.includes("existe déjà")
            ) {
              setReservationConfirmed(true);
            } else {
              throw new Error(
                confirmResult.error ||
                  "Erreur lors de la confirmation de la réservation"
              );
            }
          }
        } else {
          throw new Error("Le paiement n'a pas été effectué");
        }
      } catch (err: unknown) {
        console.error("Erreur:", err);
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
      } finally {
        setLoading(false);
      }
    };

    processPayment();
  }, [sessionId, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <Loader2 className="animate-spin h-10 w-10 text-[#F6B99C] mb-4" />
        <p className="text-gray-600">Traitement de votre réservation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md my-10">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <div className="text-red-500 text-xl mb-4">
            Erreur lors de la réservation
          </div>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              href="/"
              className="inline-flex items-center px-5 py-2 bg-[#F6B99C] rounded-lg text-white hover:bg-[#e6a98c]"
            >
              Retour à l&apos;accueil
            </Link>
            <Link
              href="/my-reservations"
              className="inline-flex items-center px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Mes réservations
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md my-10">
      <div className="text-center mb-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800">
          Réservation confirmée !
        </h1>
        <p className="text-gray-600 mt-2">
          Merci pour votre réservation. Votre paiement a été traité avec succès.
        </p>
        {reservationConfirmed && (
          <p className="text-green-600 mt-2 font-medium">
            ✅ Votre réservation a été enregistrée dans notre système.
          </p>
        )}
      </div>

      {sessionDetails && (
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-xl font-semibold mb-4">
            Détails de la réservation
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Numéro de réservation
              </h3>
              <p className="text-gray-800 text-sm break-all">
                {sessionDetails.id}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Date</h3>
              <p className="text-gray-800">
                {new Date(sessionDetails.created * 1000).toLocaleDateString(
                  "fr-FR"
                )}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Total payé
              </h3>
              <p className="text-gray-800 font-medium">
                {sessionDetails.amount_total
                  ? (sessionDetails.amount_total / 100).toFixed(2)
                  : "0.00"}{" "}
                €
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Statut du paiement
              </h3>
              <p className="text-gray-800">
                {sessionDetails.payment_status === "paid"
                  ? "Payé"
                  : "En attente"}
              </p>
            </div>
          </div>

          {/* Détails du casier réservé */}
          {sessionDetails.line_items && sessionDetails.line_items.data && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Casier réservé</h3>
              <div className="border rounded-lg overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {sessionDetails.line_items.data.map((item) => (
                    <div key={item.id} className="p-4">
                      <div className="flex-grow">
                        <h4 className="font-medium">
                          {item.price?.product?.name || item.description}
                        </h4>
                        <div className="text-sm text-gray-500 mt-1">
                          <span className="mr-2">
                            Quantité: {item.quantity}
                          </span>
                          <span>
                            Prix: {(item.amount_total / 100).toFixed(2)} €
                          </span>
                        </div>
                        {sessionDetails.metadata && (
                          <div className="text-sm text-gray-500 mt-2">
                            <p>Taille: {sessionDetails.metadata.lockerSize}</p>
                            <p>
                              Position: {sessionDetails.metadata.lockerPosition}
                            </p>
                            <p>
                              Du:{" "}
                              {new Date(
                                sessionDetails.metadata.startDate
                              ).toLocaleDateString("fr-FR")}
                            </p>
                            <p>
                              Au:{" "}
                              {new Date(
                                sessionDetails.metadata.endDate
                              ).toLocaleDateString("fr-FR")}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
        <Link
          href="/"
          className="inline-flex items-center justify-center px-5 py-3 bg-[#F6B99C] rounded-lg text-white hover:bg-[#e6a98c] transition-colors"
        >
          Retour à l&apos;accueil
        </Link>

        <Link
          href="/my-reservations"
          className="inline-flex items-center justify-center px-5 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Voir mes réservations
        </Link>
      </div>
    </div>
  );
}

import { getUserReservations } from "@/actions/reservations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	AlertCircle,
	CalendarRange,
	Clock,
	Package,
	TrendingUp,
	CalendarDays,
} from "lucide-react";
import dayjs from "dayjs";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import CancelReservationButton from "@/components/Reservations/CancelReservationButton";

interface Locker {
  _id: string;
  name: string;
  location?: string;
}

interface Reservation {
  _id: string;
  lockerId: Locker;
  startDate: string;
  endDate: string;
  status: "active" | "ended";
}

export default async function MyReservationsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) {
    redirect("/sign-in");
  }

  const { success, data: reservations, error } = await getUserReservations();

  // Calculer les statistiques
  const totalReservations = reservations?.length || 0;
  const activeReservations = reservations?.filter(r => r.status === "active").length || 0;
  const completedReservations = reservations?.filter(r => r.status === "ended").length || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8 animate-fadeIn">
      {/* Header avec statistiques */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-primary text-white p-8 shadow-lg">
        <div className="relative z-10">
          <div className="flex flex-col gap-2 mb-6">
            <h1 className="text-3xl font-bold">Mes réservations</h1>
            <p className="text-white/90 text-lg">
              Gérez et suivez vos réservations de casiers
            </p>
          </div>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalReservations}</p>
                  <p className="text-white/80 text-sm">Total</p>
                </div>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeReservations}</p>
                  <p className="text-white/80 text-sm">Actives</p>
                </div>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <CalendarDays className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{completedReservations}</p>
                  <p className="text-white/80 text-sm">Terminées</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-72 h-72 opacity-10 rounded-full bg-white translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 right-24 w-32 h-32 opacity-10 rounded-full bg-white translate-y-1/2" />
      </div>

      {!success && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>
            {error || "Impossible de récupérer vos réservations."}
          </AlertDescription>
        </Alert>
      )}

      {success && reservations?.length === 0 && (
        <Card className="border-none shadow-soft bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-12 text-center">
            <div className="bg-primary/10 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <CalendarRange className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Aucune réservation</h3>
            <p className="text-gray-600 mb-6">
              Vous n'avez pas encore réservé de casier. Commencez par explorer nos casiers disponibles !
            </p>
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <p className="text-sm text-primary font-medium">
                💡 Conseil : Utilisez les filtres sur la page d'accueil pour trouver le casier parfait
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {success &&
          reservations?.map((reservation: Reservation) => {
            const startDate = dayjs(reservation.startDate);
            const endDate = dayjs(reservation.endDate);
            const now = dayjs();
            const isActive = reservation.status === "active";
            const isUpcoming = startDate.isAfter(now);
            const isPast = endDate.isBefore(now);
						const duration = endDate.diff(startDate, "day") + 1;

            return (
              <Card
                key={reservation._id}
                className={`overflow-hidden border-none shadow-soft transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${isActive ? 'bg-gradient-to-br from-green-50 to-white' :
                  isUpcoming ? 'bg-gradient-to-br from-blue-50 to-white' :
                    'bg-gradient-to-br from-gray-50 to-white'
                  }`}
              >
                <CardHeader className="pb-4">
                  <div className="bg-gradient-primary text-white p-4 rounded-t-xl -mx-6 -mt-6 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-lg">
                          {reservation.lockerId?.name || "Casier"}
                        </h3>
                        <p className="text-white/80 text-sm">
                          {reservation.lockerId?.location || "Emplacement non spécifié"}
                        </p>
                      </div>
                      <Badge
                        variant={
                          isActive ? "secondary" : "outline"
                        }
                        className={`${isActive ? 'bg-green-500 text-white' :
                          isUpcoming ? 'bg-blue-500 text-white' :
                            'bg-gray-500 text-white'
                          }`}
                      >
                        {isActive ? "Active" : isUpcoming ? "À venir" : "Terminée"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Informations de dates */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CalendarRange className="h-4 w-4" />
                        <span>Du {startDate.format("DD/MM/YYYY")}</span>
                      </div>
                      <span className="text-gray-400">→</span>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>Au {endDate.format("DD/MM/YYYY")}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                      <CalendarDays className="h-4 w-4" />
                      <span>{duration} jour{duration > 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-gray-100 space-y-3">
                    {isActive && (
                      <div className="pt-2">
                        <CancelReservationButton reservationId={reservation._id} />
                      </div>
                    )}
                    {isUpcoming && (
                      <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-700 font-medium">
                          Votre réservation commence bientôt !
                        </p>
                      </div>
                    )}
                    {isPast && (
                      <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-600">
                          Réservation terminée le {endDate.format("DD/MM/YYYY")}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </div>
  );
}

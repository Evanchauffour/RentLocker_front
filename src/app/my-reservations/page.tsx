import { getUserReservations } from "@/actions/reservations";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, CalendarRange, MapPin } from "lucide-react";
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Mes réservations</h1>

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
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <CalendarRange className="h-8 w-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-medium">Aucune réservation</h3>
          <p className="text-gray-500 mt-2">
            Vous n'avez pas encore réservé de casier.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {success &&
          reservations?.map((reservation: Reservation) => (
            <Card
              key={reservation._id}
              className="overflow-hidden border-none shadow-soft"
            >
              <CardContent className="p-0">
                <div className="bg-gradient-primary text-white p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-lg">
                      {reservation.lockerId?.name || "Casier"}
                    </h3>
                    <Badge
                      variant={
                        reservation.status === "active"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {reservation.status === "active" ? "Active" : "Terminée"}
                    </Badge>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <CalendarRange className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">
                        Période de réservation
                      </p>
                      <p className="font-medium">
                        Du {dayjs(reservation.startDate).format("DD/MM/YYYY")}{" "}
                        au {dayjs(reservation.endDate).format("DD/MM/YYYY")}
                      </p>
                    </div>
                  </div>

                  {reservation.lockerId?.location && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Emplacement</p>
                        <p className="font-medium">
                          {reservation.lockerId.location}
                        </p>
                      </div>
                    </div>
                  )}

                  {reservation.status === "active" && (
                    <CancelReservationButton reservationId={reservation._id} />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}

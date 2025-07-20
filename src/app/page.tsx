import React from "react";
import LockersTable from "@/components/Admin/LockersTable";
import WelcomeSection from "@/components/Home/WelcomeSection";
import { Locker } from "./(admin)/administration/page";
import HomeFilters from "@/components/Home/HomeFilters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarRange, MapPin, ShieldCheck } from "lucide-react";

async function getLockers(
  startDate: string,
  endDate: string,
  priceSort?: string,
  size?: string,
  availability?: string
): Promise<Locker[]> {
  if (startDate === "" || endDate === "") {
    return [];
  }

  try {
    const params = new URLSearchParams({
      startDate,
      endDate,
    });

    if (priceSort && priceSort !== "all") {
      params.append("priceSort", priceSort);
    }
    if (size && size !== "all") {
      params.append("size", size);
    }
    if (availability && availability !== "all") {
      params.append("availability", availability);
    }

    const response = await fetch(
      `http://localhost:8000/api/lockers?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch lockers");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching lockers:", error);
    return [];
  }
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    startDate?: string;
    endDate?: string;
    priceSort?: string;
    size?: string;
    availability?: string;
  }>;
}) {
  const params = await searchParams;
  const lockers = await getLockers(
    params.startDate || "",
    params.endDate || "",
    params.priceSort,
    params.size,
    params.availability
  );

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fadeIn">
      <WelcomeSection />

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="border-none shadow-soft bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-6 flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <CalendarRange className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-lg mb-1">Réservation flexible</h3>
              <p className="text-gray-600 text-sm">
                Réservez vos casiers pour la durée qui vous convient
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-soft bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-6 flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-lg mb-1">Localisation précise</h3>
              <p className="text-gray-600 text-sm">
                Trouvez facilement vos casiers grâce au système de coordonnées
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-soft bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-6 flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-lg mb-1">Sécurité garantie</h3>
              <p className="text-gray-600 text-sm">
                Vos affaires sont protégées dans nos casiers sécurisés
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border rounded-xl shadow-soft">
        <CardHeader className="bg-gray-50 rounded-t-xl border-b">
          <CardTitle className="text-xl font-semibold text-gray-800">
            Trouver un casier
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <HomeFilters />
          </div>

          {lockers.length > 0 ? (
            <LockersTable lockers={lockers} isInAdmin={false} />
          ) : params.startDate && params.endDate ? (
            <div className="flex flex-col items-center justify-center gap-4 p-8 bg-gray-50 rounded-lg">
              <svg
                className="h-16 w-16 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 14h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-lg font-semibold text-gray-700">
                Aucun casier disponible pour les critères sélectionnés.
              </p>
              <p className="text-sm text-gray-500">
                Essayez de modifier vos filtres pour voir d&apos;autres options.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 p-8 bg-gradient-secondary rounded-lg">
              <CalendarRange className="h-16 w-16 text-primary" />
              <p className="text-lg font-semibold text-gray-700">
                Commencez votre recherche de casiers
              </p>
              <p className="text-sm text-gray-500">
                Sélectionnez les dates de début et de fin pour voir les casiers
                disponibles.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

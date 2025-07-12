"use client";

import dayjs from "dayjs";
import React, { useState, useEffect } from "react";
import { DatePicker } from "../ui/datePicker";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { CalendarSearch, ChevronRight, Filter, TrendingUp } from "lucide-react";

export default function HomeFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [startDate, setStartDate] = useState<Date | undefined>(
    searchParams.get("startDate")
      ? dayjs(searchParams.get("startDate")).toDate()
      : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    searchParams.get("endDate")
      ? dayjs(searchParams.get("endDate")).toDate()
      : undefined
  );

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    const params = new URLSearchParams(searchParams);

    if (date) {
      if (endDate && date > endDate) {
        setEndDate(date);
        params.set("endDate", dayjs(date).format("YYYY-MM-DD"));
      }
      params.set("startDate", dayjs(date).format("YYYY-MM-DD"));
    } else {
      params.delete("startDate");
    }

    router.push(`/?${params.toString()}`, { scroll: false });
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    const params = new URLSearchParams(searchParams);

    if (date) {
      if (startDate && date < startDate) {
        setStartDate(date);
        params.set("startDate", dayjs(date).format("YYYY-MM-DD"));
      }
      params.set("endDate", dayjs(date).format("YYYY-MM-DD"));
    } else {
      params.delete("endDate");
    }

    router.push(`/?${params.toString()}`, { scroll: false });
  };

  const handleFilterChange = (filterType: string, value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value && value !== "all") {
      params.set(filterType, value);
    } else {
      params.delete(filterType);
    }

    router.push(`/?${params.toString()}`, { scroll: false });
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 rounded-lg border border-primary/10 mb-2">
        <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
          <CalendarSearch className="mr-2 h-5 w-5 text-primary" />
          Période de location
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DatePicker
            label="Date de début"
            placeholder="Sélectionner une date de début"
            initialDate={startDate}
            onDateChange={handleStartDateChange}
          />
          <DatePicker
            label="Date de fin"
            placeholder="Sélectionner une date de fin"
            initialDate={endDate}
            onDateChange={handleEndDateChange}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Filter className="mr-1 h-4 w-4 text-gray-500" />
            Filtres
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <Select
                value={searchParams.get("priceSort") || "all"}
                onValueChange={(value) =>
                  handleFilterChange("priceSort", value)
                }
              >
                <SelectTrigger className="w-full">
                  <div className="flex items-center">
                    <TrendingUp className="h-3.5 w-3.5 mr-2 text-gray-500" />
                    <SelectValue placeholder="Prix" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les prix</SelectItem>
                  <SelectItem value="asc">Prix croissant</SelectItem>
                  <SelectItem value="desc">Prix décroissant</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Select
                value={searchParams.get("size") || "all"}
                onValueChange={(value) => handleFilterChange("size", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Taille" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes tailles</SelectItem>
                  <SelectItem value="S">Petit (S)</SelectItem>
                  <SelectItem value="M">Moyen (M)</SelectItem>
                  <SelectItem value="L">Grand (L)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Select
                value={searchParams.get("availability") || "all"}
                onValueChange={(value) =>
                  handleFilterChange("availability", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Disponibilité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="available">Disponibles</SelectItem>
                  <SelectItem value="unavailable">Indisponibles</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Button
          className="bg-primary hover:bg-primary/90 shadow-sm flex items-center gap-1 btn-hover-effect"
          onClick={() => {
            // Reset filters but keep dates
            const params = new URLSearchParams();
            if (startDate)
              params.set("startDate", dayjs(startDate).format("YYYY-MM-DD"));
            if (endDate)
              params.set("endDate", dayjs(endDate).format("YYYY-MM-DD"));
            router.push(`/?${params.toString()}`, { scroll: false });
          }}
        >
          Réinitialiser les filtres <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

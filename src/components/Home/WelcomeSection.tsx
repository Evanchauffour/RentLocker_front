"use client";

import { useUserStore } from "@/stores/userStore";
import React from "react";
import { CalendarClock, Package } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export default function WelcomeSection() {
  const { user } = useUserStore();

  return (
    <>
      {user && (
        <div className="relative overflow-hidden rounded-xl bg-gradient-primary text-white p-8 mb-8 shadow-lg">
          <div className="relative z-10">
            <div className="flex flex-col gap-2 mb-6">
              <h1 className="text-3xl font-bold">
                Bienvenue, {user?.firstName} {user?.lastName}!
              </h1>
              <p className="text-white/90 text-lg">
                Gérez vos casiers et consultez votre historique en toute
                simplicité
              </p>
            </div>

            <div className="flex flex-wrap gap-4 mt-4">
              <Button
                variant="secondary"
                className="bg-white text-primary hover:bg-gray-100 shadow-sm flex gap-2 items-center btn-hover-effect"
                asChild
              >
                <Link href="/mes-reservations">
                  <CalendarClock size={18} />
                  Mes réservations
                </Link>
              </Button>

              <Button
                variant="outline"
                className="bg-white/20 text-white border-white/30 hover:bg-white/30 shadow-sm flex gap-2 items-center btn-hover-effect"
                asChild
              >
                <Link href="/guide-utilisation">
                  <Package size={18} />
                  Guide d'utilisation
                </Link>
              </Button>
            </div>
          </div>

          <div className="absolute top-0 right-0 w-72 h-72 opacity-10 rounded-full bg-white translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 right-24 w-32 h-32 opacity-10 rounded-full bg-white translate-y-1/2" />
        </div>
      )}
    </>
  );
}

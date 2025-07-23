"use client";

import Link from "next/link";
import { Calendar, Shield } from "lucide-react";

export default function QuickActions() {
    const scrollToPasswordSection = () => {
        const passwordSection = document.querySelector('[data-password-section]');
        if (passwordSection) {
            passwordSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="space-y-3">
            <Link href="/my-reservations">
                <div className="p-3 bg-white/50 rounded-lg hover:bg-white/70 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                        <div className="bg-purple-100 p-2 rounded-full">
                            <Calendar className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                            <p className="font-medium text-sm">Voir mes réservations</p>
                            <p className="text-xs text-gray-500">Historique complet</p>
                        </div>
                    </div>
                </div>
            </Link>

            <div
                className="p-3 bg-white/50 rounded-lg hover:bg-white/70 transition-colors cursor-pointer"
                onClick={scrollToPasswordSection}
            >
                <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded-full">
                        <Shield className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                        <p className="font-medium text-sm">Sécurité du compte</p>
                        <p className="text-xs text-gray-500">Changer le mot de passe</p>
                    </div>
                </div>
            </div>
        </div>
    );
} 
import React from "react";
import { getUserProfile } from "@/actions/user";
import ProfileForm from "@/components/ui/ProfileForm";
import { cookies } from "next/headers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Shield, Calendar, Mail } from "lucide-react";
import QuickActions from "@/components/ui/QuickActions";

export default async function ProfilePage() {
    const token = cookies().get("token")?.value;

    const result = await getUserProfile(token);

    if (!result.success) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-10">
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="p-6">
                        <p className="text-red-600 text-center">Erreur : {result.error}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const user = result.data;

    return (
        <div className="max-w-6xl mx-auto px-4 py-10 space-y-8 animate-fadeIn">
            {/* Header Section */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-primary text-white p-8 shadow-lg">
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <div className="relative">
                            <div className="h-24 w-24 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center">
                                <img
                                    className="h-20 w-20 rounded-full object-cover"
                                    alt={`${user.firstName} ${user.lastName}`}
                                    src={`https://api.dicebear.com/7.x/micah/svg?seed=${user.email}`}
                                />
                            </div>
                            <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>

                        <div className="text-center md:text-left">
                            <h1 className="text-3xl font-bold mb-2">
                                {user.firstName} {user.lastName}
                            </h1>
                            <p className="text-white/90 text-lg mb-4">
                                Gérez vos informations personnelles et vos préférences
                            </p>
                            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                                    <User size={14} className="mr-1" />
                                    Utilisateur
                                </Badge>
                                {user.role === 'admin' && (
                                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                                        <Shield size={14} className="mr-1" />
                                        Administrateur
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-72 h-72 opacity-10 rounded-full bg-white translate-x-1/3 -translate-y-1/3" />
                <div className="absolute bottom-0 right-24 w-32 h-32 opacity-10 rounded-full bg-white translate-y-1/2" />
            </div>

            {/* Profile Information Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Personal Information Card */}
                <Card className="border-none shadow-soft bg-gradient-to-br from-blue-50 to-white">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <User className="h-5 w-5 text-primary" />
                            Informations personnelles
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                            <div className="bg-primary/10 p-2 rounded-full">
                                <User className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Nom complet</p>
                                <p className="font-medium">{user.firstName} {user.lastName}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                            <div className="bg-primary/10 p-2 rounded-full">
                                <Mail className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Email</p>
                                <p className="font-medium">{user.email}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Account Statistics Card */}
                <Card className="border-none shadow-soft bg-gradient-to-br from-green-50 to-white">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Calendar className="h-5 w-5 text-green-600" />
                            Statistiques du compte
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-4 bg-white/50 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">0</div>
                                <div className="text-sm text-gray-600">Réservations actives</div>
                            </div>
                            <div className="text-center p-4 bg-white/50 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">0</div>
                                <div className="text-sm text-gray-600">Réservations totales</div>
                            </div>
                        </div>
                        <div className="p-3 bg-green-100/50 rounded-lg border border-green-200">
                            <p className="text-sm text-green-700 text-center">
                                Compte créé récemment
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions Card */}
                <Card className="border-none shadow-soft bg-gradient-to-br from-purple-50 to-white">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Shield className="h-5 w-5 text-purple-600" />
                            Actions rapides
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <QuickActions />
                    </CardContent>
                </Card>
            </div>

            {/* Profile Form Card */}
            <Card className="border-none shadow-soft">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-xl border-b">
                    <CardTitle className="text-xl font-semibold text-gray-800">
                        Modifier mes informations
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <ProfileForm user={user} />
                </CardContent>
            </Card>
        </div>
    );
}

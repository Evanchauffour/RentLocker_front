import React from "react";
import { getUserProfile } from "@/actions/user";
import ProfileForm from "@/components/ui/ProfileForm";
import { cookies } from "next/headers";

export default async function ProfilePage() {
    const token = cookies().get("token")?.value;

    const result = await getUserProfile(token);

    if (!result.success) {
        return <p className="text-red-500 mt-10">Erreur : {result.error}</p>;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
                  <h1 className="text-3xl font-semibold">Mon profil</h1>

            <div className="flex w-full justify-center">
                <img data-slot="avatar-image" className="h-[20vh]" alt="adilz" src="https://api.dicebear.com/7.x/micah/svg?seed=adil@example.com"></img>
            </div>
            
            <ProfileForm user={result.data} />
        </div>
    );
}

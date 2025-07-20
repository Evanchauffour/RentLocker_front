"use client";

import { useState } from "react";

export default function ProfileForm({ user }) {
  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/auth/update-profile`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...formData }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.message || "Erreur lors de la mise à jour");
    } else {
      setSuccess("Profil mis à jour avec succès !");
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordFields(false);
    }
  };

  return (
    <form onSubmit={handleUpdate} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Prénom</label>
          <input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Nom</label>
          <input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
      </div>

      <div>
        <label className="block font-medium">Email</label>
        <input
          name="email"
          value={formData.email}
          disabled
          className="w-full border p-2 bg-gray-100 rounded"
        />
      </div>

      <div className="pt-6 border-t">
        <label className="block font-medium mb-2">Mot de passe</label>

        {!showPasswordFields ? (
          <div className="flex items-center justify-between">
            <input
              type="password"
              value="••••••••"
              disabled
              className="w-full border p-2 bg-gray-100 rounded mr-2"
            />
            <button
              type="button"
              onClick={() => setShowPasswordFields(true)}
              className="px-4 py-2 bg-primary text-white rounded"
            >
              Modifier
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <input
              name="currentPassword"
              type="password"
              placeholder="Mot de passe actuel"
              value={formData.currentPassword}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            <input
              name="newPassword"
              type="password"
              placeholder="Nouveau mot de passe"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirmer le mot de passe"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            <button
              type="button"
              onClick={() => {
                setShowPasswordFields(false);
                setFormData({
                  ...formData,
                  currentPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                });
              }}
              className="text-sm text-gray-500 hover:underline"
            >
              Annuler
            </button>
          </div>
        )}
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}

      <button type="submit" className="px-4 py-2 bg-primary text-white rounded">
        Enregistrer les modifications
      </button>
    </form>
  );
}

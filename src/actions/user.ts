"use server";

export async function getUserProfile(token?: string) {
  if (!token) {
    return { success: false, error: "No token" };
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Passe le token dans les headers
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { success: false, error: "Failed to fetch user profile" };
  }
}

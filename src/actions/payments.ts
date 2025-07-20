"use server";

import { getStripeServer } from "@/lib/stripe";
import { CheckoutSessionRequest, StripeCheckoutSession } from "@/types/payment";
import { cookies } from "next/headers";

export async function createCheckoutSession(data: CheckoutSessionRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return { success: false, error: "Authentication required" };
  }

  try {
    const userResponse = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      }/api/auth/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!userResponse.ok) {
      return {
        success: false,
        error: "Impossible de récupérer les informations utilisateur",
      };
    }

    const userData = await userResponse.json();
    const customerEmail = userData.user?.email;

    if (!customerEmail) {
      return { success: false, error: "Email utilisateur non trouvé" };
    }

    const stripe = getStripeServer();
    const origin = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Réservation - ${data.lockerName}`,
              description: `Réservation du ${new Date(
                data.startDate
              ).toLocaleDateString("fr-FR")} au ${new Date(
                data.endDate
              ).toLocaleDateString("fr-FR")}`,
            },
            unit_amount: Math.round(data.price * 100),
          },
          quantity: 1,
        },
      ],
      customer_email: customerEmail,
      success_url:
        data.successUrl ||
        `${origin}/reservation/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: data.cancelUrl || `${origin}/my-reservations`,
      metadata: {
        lockerId: data.lockerId,
        startDate: data.startDate,
        endDate: data.endDate,
        ...data.metadata,
      },
    });

    return {
      success: true,
      sessionId: session.id,
      url: session.url,
    };
  } catch (error) {
    console.error(
      "Erreur lors de la création de la session de paiement:",
      error
    );
    return {
      success: false,
      error: "Erreur lors de la création de la session de paiement",
    };
  }
}

export async function getCheckoutSession(sessionId: string) {
  try {
    const stripe = getStripeServer();

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "line_items.data.price.product"],
    });

    const checkoutSession: StripeCheckoutSession = {
      id: session.id,
      created: session.created,
      amount_total: session.amount_total,
      currency: session.currency || "eur",
      customer_email: session.customer_email || undefined,
      payment_status: session.payment_status || undefined,
      metadata: session.metadata || undefined,
      line_items: session.line_items
        ? {
            data: session.line_items.data.map((item) => ({
              id: item.id,
              amount_total: item.amount_total || 0,
              currency: item.currency || "eur",
              description: item.description || "",
              quantity: item.quantity || 0,
              price: item.price
                ? {
                    product: {
                      name:
                        (
                          item.price.product as {
                            name?: string;
                            description?: string;
                          }
                        )?.name || "",
                      description:
                        (
                          item.price.product as {
                            name?: string;
                            description?: string;
                          }
                        )?.description || undefined,
                    },
                    unit_amount: item.price.unit_amount || 0,
                  }
                : undefined,
            })),
          }
        : undefined,
    };

    return { success: true, session: checkoutSession };
  } catch (error) {
    console.error("Erreur lors de la récupération de la session:", error);
    return {
      success: false,
      error: "Erreur lors de la récupération de la session",
    };
  }
}

export async function confirmReservationAfterPayment(sessionId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return { success: false, error: "Authentication required" };
  }

  try {
    const stripe = getStripeServer();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return { success: false, error: "Le paiement n'a pas été effectué" };
    }

    const { lockerId, startDate, endDate } = session.metadata || {};

    if (!lockerId || !startDate || !endDate) {
      return { success: false, error: "Données de réservation manquantes" };
    }

    console.log("Tentative de création de réservation avec:", {
      lockerId,
      startDate,
      endDate,
      stripeSessionId: sessionId,
    });

    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      }/api/reservation`,
      {
        method: "POST",
        body: JSON.stringify({
          lockerId,
          startDate,
          endDate,
          stripeSessionId: sessionId,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Erreur backend:", {
        status: response.status,
        statusText: response.statusText,
        errorData,
      });
      throw new Error(`Erreur backend: ${response.status} - ${errorData}`);
    }

    const reservationData = await response.json();
    console.log("Réservation créée avec succès:", reservationData);

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la confirmation de la réservation:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erreur lors de la confirmation de la réservation",
    };
  }
}

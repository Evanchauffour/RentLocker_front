import Stripe from "stripe";

// Configuration côté serveur
export const getStripeServer = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not defined");
  }
  return new Stripe(secretKey, {
    apiVersion: "2025-06-30.basil",
  });
};

// Configuration côté client
export const getStripeClient = () => {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!publishableKey) {
    throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined");
  }
  return publishableKey;
};

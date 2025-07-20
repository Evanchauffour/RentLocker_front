export interface CheckoutSessionRequest {
  lockerId: string;
  startDate: string;
  endDate: string;
  price: number;
  lockerName: string;
  customerEmail?: string; // Optionnel car récupéré côté serveur
  metadata?: Record<string, string>;
  successUrl?: string;
  cancelUrl?: string;
}

export interface PaymentIntentRequest {
  amount: number;
  currency: string;
  metadata?: Record<string, string>;
}

export interface StripeCheckoutSession {
  id: string;
  created: number;
  amount_total: number | null;
  currency: string;
  customer_email?: string;
  payment_status?: string;
  metadata?: Record<string, string>;
  line_items?: {
    data: Array<{
      id: string;
      amount_total: number;
      currency: string;
      description: string;
      quantity: number;
      price?: {
        product: {
          name: string;
          description?: string;
        };
        unit_amount: number;
      };
    }>;
  };
}

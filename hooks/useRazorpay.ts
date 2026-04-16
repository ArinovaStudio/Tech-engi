"use client";

import { useState } from "react";
import toast from "react-hot-toast";

interface RazorpayOptions {
  projectId: string;
  amount: number;
  description?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  onDismiss?: () => void;
}

export const useRazorpay = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initiatePayment = async (options: RazorpayOptions) => {
    const {
      projectId,
      amount,
      description = "Project Advance Payment",
      onSuccess,
      onError,
      onDismiss,
    } = options;

    try {
      setLoading(true);
      setError(null);

      // Get order from backend
      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });

      const orderData = await orderRes.json();

      if (!orderData.success) {
        const errorMsg = orderData.message || "Failed to create payment order";
        setError(errorMsg);
        onError?.(errorMsg);
        return;
      }

      // Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        order_id: orderData.order.id,
        amount: Math.round(amount * 100),
        currency: "INR",
        name: "Tech-Engi",
        description,
        image: "/logo.png",
        handler: async (response: any) => {
          try {
            setLoading(true);

            // Verify payment
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              toast.success("Payment successful!");
              onSuccess?.();
            } else {
              const errorMsg = verifyData.message || "Payment verification failed";
              setError(errorMsg);
              onError?.(errorMsg);
            }
          } catch (err) {
            const errorMsg = "Payment verification failed";
            setError(errorMsg);
            onError?.(errorMsg);
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          email: "", // Set from session if available
          contact: "",
        },
        theme: {
          color: "var(--primary)",
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.error("Payment cancelled");
            onDismiss?.();
          },
        },
      };

      // Load and open Razorpay
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;

      script.onload = () => {
        const Razorpay = (window as any).Razorpay;
        if (!Razorpay) {
          const errorMsg = "Razorpay script failed to load";
          setError(errorMsg);
          onError?.(errorMsg);
          return;
        }

        const razorpayInstance = new Razorpay(options);
        razorpayInstance.open();
      };

      script.onerror = () => {
        const errorMsg = "Failed to load Razorpay";
        setError(errorMsg);
        onError?.(errorMsg);
      };

      document.body.appendChild(script);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Payment setup failed";
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    loading,
    error,
    initiatePayment,
    clearError,
  };
};

// Usage example:
/*
const { loading, error, initiatePayment } = useRazorpay();

const handlePayment = async () => {
  await initiatePayment({
    projectId: "project-123",
    amount: 4000,
    description: "Project Advance Payment (40%)",
    onSuccess: () => {
      router.push("/dashboard/projects");
    },
    onError: (error) => {
      console.error("Payment failed:", error);
    },
    onDismiss: () => {
      console.log("Payment cancelled");
    },
  });
};
*/
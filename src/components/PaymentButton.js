// src/components/PaymentButton.js
import React from "react";
import { usePaystackPayment } from "react-paystack";

const publicKey = process.env.REACT_APP_PAYSTACK_PUBLIC_KEY;

export default function PaymentButton({
  email,
  amount,
  metadata = {},
  onSuccess,
  onClose,
}) {
  const initializePayment = usePaystackPayment({
    reference: `${Date.now()}`,
    email,
    amount: amount * 100, // Paystack expects amount in kobo
    publicKey,
    metadata,
    currency: "NGN",
  });

  const handleClick = () => {
    if (!publicKey) {
      alert("Payment temporarily unavailable (Paystack key missing).");
      return;
    }
    initializePayment(onSuccess, onClose);
  };

  return (
    <button
      onClick={handleClick}
      className="bg-green-500 text-black font-bold px-6 py-3 rounded-lg hover:bg-green-400 transition"
    >
      Pay with Paystack
    </button>
  );
}

import apiFetch from "./config";

export const createPaymentLink = (orderId: number) => {
  return apiFetch("/api/v1/payment/create-payment-link", {
    method: "POST",
    body: JSON.stringify({ orderId }),
  });
};

export const verifyPayment = (orderId: number) => {
  return apiFetch("/api/v1/payment/verify-payment", {
    method: "POST",
    body: JSON.stringify({ orderId }),
  });
};

export const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!;
export const secretKey = process.env.TOSS_SECRET_KEY!;

// 결제 확인 API
export const confirmPayment = async (
  paymentKey: string,
  orderId: string,
  amount: number,
) => {
  const response = await fetch(
    "https://api.tosspayments.com/v1/payments/confirm",
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(secretKey + ":").toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paymentKey, orderId, amount }),
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "결제 확인 실패");
  }

  return response.json();
};

// 결제 조회 API
export const getPayment = async (paymentKey: string) => {
  const response = await fetch(
    `https://api.tosspayments.com/v1/payments/${paymentKey}`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(secretKey + ":").toString("base64")}`,
      },
    },
  );

  if (!response.ok) throw new Error("결제 조회 실패");
  return response.json();
};

// 결제 취소 API
export const cancelPayment = async (
  paymentKey: string,
  cancelReason: string,
) => {
  const response = await fetch(
    `https://api.tosspayments.com/v1/payments/${paymentKey}/cancel`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(secretKey + ":").toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cancelReason }),
    },
  );

  if (!response.ok) throw new Error("결제 취소 실패");
  return response.json();
};

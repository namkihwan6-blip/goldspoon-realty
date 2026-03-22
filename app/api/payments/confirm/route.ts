import { NextRequest, NextResponse } from "next/server";
import { confirmPayment } from "@/lib/toss-payments";

export async function POST(request: NextRequest) {
  try {
    const { paymentKey, orderId, amount } = await request.json();

    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json(
        { error: "필수 결제 정보가 없습니다." },
        { status: 400 },
      );
    }

    const payment = await confirmPayment(paymentKey, orderId, amount);

    // TODO: Firebase에 결제 정보 저장
    console.log("결제 완료:", payment);

    return NextResponse.json(payment);
  } catch (error) {
    console.error("결제 확인 실패:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "결제 확인에 실패했습니다." },
      { status: 400 },
    );
  }
}

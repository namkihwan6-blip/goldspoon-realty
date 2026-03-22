"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Link from "next/link";
import { CheckCircle, AlertCircle } from "lucide-react";
import { db, auth } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";

function SuccessContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    const confirm = async () => {
      const paymentKey = searchParams.get("paymentKey");
      const orderId = searchParams.get("orderId");
      const amount = searchParams.get("amount");

      if (!paymentKey || !orderId || !amount) {
        setError("결제 정보가 올바르지 않습니다.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/payments/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: parseInt(amount),
          }),
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || "결제 확인 실패");
        }

        const data = await response.json();
        setPaymentInfo(data);

        // Save payment record to Firestore
        try {
          await addDoc(collection(db, "payments"), {
            paymentKey,
            orderId,
            amount: parseInt(amount),
            status: "completed",
            method: data.method || "",
            orderName: data.orderName || "",
            userId: auth.currentUser?.uid || "",
            createdAt: new Date().toISOString(),
          });
        } catch (firestoreErr) {
          console.error("결제 기록 저장 실패:", firestoreErr);
          // Don't fail the whole flow if Firestore save fails
        }

        setLoading(false);
      } catch (e) {
        setError(e instanceof Error ? e.message : "결제 확인 중 오류가 발생했습니다.");
        setLoading(false);
      }
    };

    confirm();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="w-12 h-12 border-[3px] border-gray-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xl text-gray-500">결제 확인 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 max-w-md mx-auto">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">결제 확인 실패</h2>
        <p className="text-lg text-gray-500 mb-8">{error}</p>
        <Link href="/payment/checkout" className="px-8 py-3 bg-emerald-600 text-white rounded-xl text-lg font-medium hover:bg-emerald-700 transition-colors">
          다시 시도
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center py-20 max-w-md mx-auto">
      <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto mb-4" />
      <h2 className="text-3xl font-bold text-gray-900 mb-2">결제 완료!</h2>
      <p className="text-lg text-gray-500 mb-8">결제가 성공적으로 완료되었습니다.</p>

      {paymentInfo && (
        <div className="bg-gray-50 rounded-xl p-6 text-left mb-8 space-y-2 text-base">
          <div className="flex justify-between">
            <span className="text-gray-500">상품명</span>
            <span className="font-medium">{paymentInfo.orderName as string}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">결제 금액</span>
            <span className="font-bold text-emerald-600">{(paymentInfo.totalAmount as number)?.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">결제 수단</span>
            <span>{paymentInfo.method as string}</span>
          </div>
        </div>
      )}

      <Link href="/" className="px-8 py-3 bg-emerald-600 text-white rounded-xl text-lg font-medium hover:bg-emerald-700 transition-colors">
        홈으로 돌아가기
      </Link>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <>
      <Header />
      <main className="pt-16 min-h-screen bg-white">
        <div className="max-w-lg mx-auto px-4">
          <Suspense fallback={
            <div className="text-center py-20">
              <div className="w-12 h-12 border-[3px] border-gray-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-xl text-gray-500">로딩 중...</p>
            </div>
          }>
            <SuccessContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}

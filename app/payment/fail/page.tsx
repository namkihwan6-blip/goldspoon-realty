"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Link from "next/link";
import { XCircle } from "lucide-react";

function FailContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const message = searchParams.get("message");

  return (
    <div className="text-center py-20 max-w-md mx-auto">
      <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
      <h2 className="text-3xl font-bold text-gray-900 mb-2">결제 실패</h2>
      <p className="text-lg text-gray-500 mb-4">
        {message || "결제 처리 중 문제가 발생했습니다."}
      </p>
      {code && (
        <p className="text-sm text-gray-400 mb-8">오류 코드: {code}</p>
      )}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/payment/checkout" className="px-8 py-3 bg-emerald-600 text-white rounded-xl text-lg font-medium hover:bg-emerald-700 transition-colors">
          다시 시도
        </Link>
        <Link href="/" className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl text-lg font-medium hover:bg-gray-200 transition-colors">
          홈으로
        </Link>
      </div>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <>
      <Header />
      <main className="pt-16 min-h-screen bg-white">
        <div className="max-w-lg mx-auto px-4">
          <Suspense fallback={<div className="text-center py-20 text-gray-500">로딩 중...</div>}>
            <FailContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}

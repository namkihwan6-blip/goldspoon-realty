"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { CreditCard, Shield, ArrowLeft, Wallet, Smartphone, Building2 } from "lucide-react";
import Link from "next/link";

// 환경변수에서 토스페이먼츠 클라이언트 키 로드
const CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!;

type PayMethod = "카드" | "계좌이체" | "가상계좌" | "휴대폰";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const tossRef = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [method, setMethod] = useState<PayMethod>("카드");

  const planName = searchParams.get("name") || "프리미엄 플랜";
  const amount = parseInt(searchParams.get("amount") || "50000");
  const planId = searchParams.get("plan") || "premium";
  const orderId = useRef(`order_${planId}_${Date.now()}`).current;

  // v1 SDK 스크립트 로드
  useEffect(() => {
    if (tossRef.current) { setReady(true); return; }

    const script = document.createElement("script");
    script.src = "https://js.tosspayments.com/v1/payment";
    script.async = true;

    script.onload = () => {
      try {
        const tp = (window as any).TossPayments(CLIENT_KEY);
        tossRef.current = tp;
        setReady(true);
      } catch (e: any) {
        setError("결제 모듈 초기화 실패: " + (e?.message || ""));
      }
    };

    script.onerror = () => {
      setError("결제 모듈을 불러올 수 없습니다. 인터넷 연결을 확인해주세요.");
    };

    document.head.appendChild(script);
  }, []);

  const handlePayment = async () => {
    if (!tossRef.current || paying) return;
    setPaying(true);

    try {
      await tossRef.current.requestPayment(method, {
        amount,
        orderId,
        orderName: planName,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
        customerName: "테스트",
        customerEmail: "test@example.com",
      });
    } catch (e: any) {
      if (e.code === "USER_CANCEL") {
        setPaying(false);
        return;
      }
      setError(e.message || "결제 요청 실패");
      setPaying(false);
    }
  };

  const methods: { value: PayMethod; label: string; icon: any }[] = [
    { value: "카드", label: "카드", icon: CreditCard },
    { value: "계좌이체", label: "계좌이체", icon: Building2 },
    { value: "가상계좌", label: "가상계좌", icon: Wallet },
    { value: "휴대폰", label: "휴대폰", icon: Smartphone },
  ];

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <Link href="/pricing" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-emerald-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        요금제로 돌아가기
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">결제하기</h1>

      {/* 주문 요약 */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-emerald-600" />
          주문 정보
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between text-base">
            <span className="text-gray-500">상품명</span>
            <span className="font-medium text-gray-900">{planName}</span>
          </div>
          <div className="flex justify-between text-base">
            <span className="text-gray-500">주문번호</span>
            <span className="font-mono text-xs text-gray-400 truncate max-w-[200px]">{orderId}</span>
          </div>
          <div className="border-t pt-3 flex justify-between items-center">
            <span className="text-gray-900 font-semibold text-lg">결제 금액</span>
            <span className="text-2xl font-bold text-emerald-600">{amount.toLocaleString()}원</span>
          </div>
        </div>
      </div>

      {/* 결제 수단 선택 */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">결제 수단 선택</h2>
        <div className="grid grid-cols-2 gap-3">
          {methods.map((m) => (
            <button
              key={m.value}
              onClick={() => setMethod(m.value)}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                method === m.value
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                  : "border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200"
              }`}
            >
              <m.icon className="w-5 h-5" />
              <span className="font-medium">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 에러 */}
      {error && (
        <div className="bg-red-50 text-red-600 rounded-xl p-5 text-center text-sm mb-6 border border-red-100">
          {error}
          <button
            onClick={() => { setError(null); setPaying(false); }}
            className="block mx-auto mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200"
          >
            다시 시도
          </button>
        </div>
      )}

      {/* 결제 버튼 */}
      <button
        onClick={handlePayment}
        disabled={!ready || paying}
        className="w-full h-14 bg-emerald-600 text-white text-lg font-semibold rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {paying ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            결제 처리 중...
          </>
        ) : !ready ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            결제 준비 중...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            {amount.toLocaleString()}원 결제하기
          </>
        )}
      </button>

      {/* 안내 */}
      <div className="mt-5 flex items-start gap-2 text-xs text-gray-400">
        <Shield className="w-4 h-4 mt-0.5 shrink-0" />
        <p>토스페이먼츠 보안 결제로 안전하게 처리됩니다. 현재 <strong>테스트 모드</strong>이므로 실제 결제가 이루어지지 않습니다.</p>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <main className="pt-16 min-h-screen bg-gray-50">
        <Suspense fallback={
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-[3px] border-gray-200 border-t-emerald-600 rounded-full animate-spin" />
          </div>
        }>
          <CheckoutContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

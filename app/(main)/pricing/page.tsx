"use client";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Link from "next/link";
import { Check, Star, Zap, Crown } from "lucide-react";

const plans = [
  {
    id: "basic",
    name: "기본",
    price: 100,
    period: "회",
    icon: Zap,
    color: "gray",
    description: "결제 테스트용 상품",
    features: [
      "매물 목록 열람",
      "기본 검색 기능",
      "상담 문의 1회/월",
    ],
    notIncluded: [
      "매물 상세 정보",
      "시세 분석 리포트",
      "우선 상담 배정",
    ],
    cta: "100원 결제 테스트",
    disabled: false,
  },
  {
    id: "premium",
    name: "프리미엄",
    price: 50000,
    period: "월",
    icon: Star,
    color: "emerald",
    description: "전문 투자자를 위한 플랜",
    popular: true,
    features: [
      "모든 매물 상세 열람",
      "실거래가 시세 분석",
      "무제한 상담 문의",
      "신규 매물 알림",
      "토지이용계획 확인",
    ],
    notIncluded: [
      "1:1 전담 컨설턴트",
    ],
    cta: "프리미엄 시작하기",
    disabled: false,
  },
  {
    id: "vip",
    name: "VIP",
    price: 150000,
    period: "월",
    icon: Crown,
    color: "amber",
    description: "대형 투자자 전용 맞춤 서비스",
    features: [
      "프리미엄 모든 기능 포함",
      "1:1 전담 컨설턴트 배정",
      "비공개 매물 우선 열람",
      "투자 수익 분석 리포트",
      "현장 방문 동행 서비스",
      "법률·세무 자문 연결",
    ],
    notIncluded: [],
    cta: "VIP 시작하기",
    disabled: false,
  },
];

export default function PricingPage() {
  return (
    <>
      <Header />
      <main className="pt-16 min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-14">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">이용 요금</h1>
            <p className="text-gray-500 text-lg">새만금 부동산 투자에 필요한 서비스를 선택하세요</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl border-2 p-8 flex flex-col ${
                  plan.popular
                    ? "border-emerald-500 shadow-lg shadow-emerald-100"
                    : "border-gray-100"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-emerald-500 text-white text-sm font-medium rounded-full">
                    가장 인기
                  </span>
                )}

                <div className="mb-6">
                  <plan.icon className={`w-10 h-10 mb-3 ${
                    plan.color === "emerald" ? "text-emerald-500" :
                    plan.color === "amber" ? "text-amber-500" : "text-gray-400"
                  }`} />
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  <p className="text-gray-500 text-sm mt-1">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price === 0 ? "무료" : `${plan.price.toLocaleString()}원`}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-gray-400 text-base">/{plan.period}</span>
                  )}
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                      <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                  {plan.notIncluded.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-300 line-through">
                      <Check className="w-5 h-5 text-gray-200 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                {plan.disabled ? (
                  <button
                    disabled
                    className="w-full py-3.5 bg-gray-100 text-gray-400 rounded-xl font-medium cursor-not-allowed"
                  >
                    {plan.cta}
                  </button>
                ) : (
                  <Link
                    href={`/payment/checkout?plan=${plan.id}&amount=${plan.price}&name=${encodeURIComponent(plan.name + " 플랜")}`}
                    className={`w-full py-3.5 rounded-xl font-medium text-center block transition-colors ${
                      plan.popular
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "bg-gray-900 text-white hover:bg-gray-800"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                )}
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-gray-400 mt-10">
            테스트 모드입니다. 실제 결제가 이루어지지 않습니다.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

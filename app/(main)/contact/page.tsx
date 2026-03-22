"use client";

import { useState } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    propertyType: "land",
    budget: "",
    area: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await addDoc(collection(db, "inquiries"), {
        name: form.name,
        phone: form.phone,
        email: form.email,
        propertyType: form.propertyType,
        budget: form.budget,
        area: form.area,
        message: form.message,
        status: "pending",
        createdAt: new Date().toISOString(),
      });
      setSubmitted(true);
    } catch {
      setError("상담 신청 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="pt-16 min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">상담 문의</h1>
            <p className="text-gray-500 text-lg">군산·새만금 지역 토지·공장 매물 상담을 무료로 받아보세요</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">연락처 정보</h3>
                <ul className="space-y-4 text-sm">
                  <li className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">전화 상담</p>
                      <p className="text-gray-500">010-4289-4924</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">이메일</p>
                      <p className="text-gray-500">goldspoon02@naver.com</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">주소</p>
                      <p className="text-gray-500">전북특별자치도 군산시 새만금북로 534-5</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">영업시간</p>
                      <p className="text-gray-500">평일 09:00 ~ 18:00<br />토요일 10:00 ~ 14:00</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Map placeholder */}
              <div className="bg-white rounded-xl overflow-hidden border border-gray-100">
                <iframe
                  src="https://maps.google.com/maps?q=%EC%A0%84%EB%B6%81%ED%8A%B9%EB%B3%84%EC%9E%90%EC%B9%98%EB%8F%84+%EA%B5%B0%EC%82%B0%EC%8B%9C+%EC%83%88%EB%A7%8C%EA%B8%88%EB%B6%81%EB%A1%9C+534-5&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="208"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              {submitted ? (
                <div className="bg-white rounded-xl p-12 border border-gray-100 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 rounded-full mb-4">
                    <Send className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">상담 신청 완료</h2>
                  <p className="text-gray-500">빠른 시일 내에 연락드리겠습니다.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 border border-gray-100 space-y-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">무료 상담 신청</h3>

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">이름 *</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="홍길동"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">연락처 *</label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="010-0000-0000"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="email@example.com"
                      disabled={loading}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">관심 매물</label>
                      <select
                        value={form.propertyType}
                        onChange={(e) => setForm({ ...form, propertyType: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        disabled={loading}
                      >
                        <option value="land">토지</option>
                        <option value="factory">공장</option>
                        <option value="both">토지 + 공장</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">예산</label>
                      <input
                        type="text"
                        value={form.budget}
                        onChange={(e) => setForm({ ...form, budget: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="예: 5억"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">희망 면적</label>
                      <input
                        type="text"
                        value={form.area}
                        onChange={(e) => setForm({ ...form, area: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="예: 300평"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">문의 내용</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={5}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                      placeholder="찾으시는 매물 조건, 용도, 희망 지역 등을 자유롭게 적어주세요."
                      disabled={loading}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "신청 중..." : "무료 상담 신청하기"}
                  </button>
                  <p className="text-xs text-gray-400 text-center">신청 후 영업일 기준 1일 이내 연락드립니다.</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

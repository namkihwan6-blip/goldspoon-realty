"use client";

import { useEffect, useState } from "react";
import HeroSection from "@/components/hero/hero-section";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import PropertyCard from "@/components/property/property-card";
import { sampleProperties } from "@/lib/sample-data";
import { Property } from "@/types/property";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import Link from "next/link";
import { ArrowRight, Shield, TrendingUp, Users, LandPlot, Factory, Phone, MapPin } from "lucide-react";

export default function Home() {
  const [allProperties, setAllProperties] = useState<Property[]>(sampleProperties);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const q = query(collection(db, "properties"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Property[];
          setAllProperties(data);
        }
        // If empty, keep sampleProperties as fallback
      } catch (err) {
        console.error("매물 로딩 실패:", err);
        // Keep sampleProperties as fallback
      }
    };

    fetchProperties();
  }, []);

  const featuredLand = allProperties.filter((p) => p.type === "land").slice(0, 3);
  const featuredFactory = allProperties.filter((p) => p.type === "factory").slice(0, 3);

  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      <Header />

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: "300+", label: "누적 거래건수" },
              { num: "새만금", label: "특화 지역" },
              { num: "150+", label: "보유 매물" },
              { num: "98%", label: "고객 만족도" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl sm:text-4xl font-bold text-emerald-600 mb-1">{stat.num}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Saemangeum Info Banner */}
      <section className="py-14 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-emerald-300" />
                <span className="text-emerald-300 text-sm font-medium">새만금 개발 특구</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                새만금, 대한민국 최대 간척지 개발사업
              </h2>
              <p className="text-emerald-100 leading-relaxed">
                총 면적 409km&sup2;, 서울 면적의 2/3에 달하는 새만금 지역은
                산업·관광·농생명·국제협력 등 복합 용도로 개발이 진행 중입니다.
                지금이 새만금 토지·공장 투자의 최적기입니다.
              </p>
            </div>
            <div className="shrink-0">
              <Link
                href="/contact"
                className="inline-flex px-6 py-3 bg-white text-emerald-700 font-medium rounded-xl hover:bg-emerald-50 transition-colors"
              >
                새만금 투자 상담
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">매물 카테고리</h2>
            <p className="text-gray-500">군산·새만금 지역 전문 매물을 확인하세요</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link href="/properties/land" className="group">
              <div className="relative h-64 rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-50 to-green-100 border border-emerald-100 flex items-center p-10 hover:shadow-xl transition-all duration-300">
                <div>
                  <LandPlot className="w-12 h-12 text-emerald-500 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">토지 매물</h3>
                  <p className="text-gray-600 mb-4">새만금 산업용지, 투자용 토지, 농지 등<br />군산·김제 지역 토지 매물을 확인하세요.</p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 group-hover:gap-2 transition-all">
                    매물 보기 <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
            <Link href="/properties/factory" className="group">
              <div className="relative h-64 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-100 flex items-center p-10 hover:shadow-xl transition-all duration-300">
                <div>
                  <Factory className="w-12 h-12 text-blue-500 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">공장 매물</h3>
                  <p className="text-gray-600 mb-4">새만금 산업단지, 군산 국가산단 등<br />산업용 부동산 매물을 확인하세요.</p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:gap-2 transition-all">
                    매물 보기 <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Land */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">추천 토지 매물</h2>
              <p className="text-gray-500 mt-1">새만금·군산 지역 엄선 토지 매물</p>
            </div>
            <Link href="/properties/land" className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700">
              전체보기 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredLand.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Factory */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">추천 공장 매물</h2>
              <p className="text-gray-500 mt-1">군산 산업단지 검증 공장 매물</p>
            </div>
            <Link href="/properties/factory" className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700">
              전체보기 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredFactory.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">왜 금수저공인중개사 사무소인가요?</h2>
            <p className="text-gray-500">군산·새만금 지역 전문 공인중개사가 함께합니다</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "새만금 전문", desc: "새만금 개발사업 현황과 토지이용계획을 정확히 파악하고 있습니다. 개발 구역별 투자 가치를 분석해드립니다." },
              { icon: TrendingUp, title: "시세 분석", desc: "군산·김제 지역 실거래가 기반 시세 분석과 새만금 개발호재를 반영한 투자 가치 평가를 제공합니다." },
              { icon: Users, title: "맞춤 컨설팅", desc: "산업용지, 관광용지, 농생명용지 등 고객의 투자 목적에 맞는 맞춤형 매물을 추천합니다." },
            ].map((item) => (
              <div key={item.title} className="text-center p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-50 rounded-xl mb-5">
                  <item.icon className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-emerald-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            새만금 토지·공장 투자 상담이 필요하신가요?
          </h2>
          <p className="text-emerald-100 text-lg mb-8">
            군산·새만금 지역 전문 상담사가 최적의 투자 매물을 찾아드립니다.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact" className="px-8 py-3.5 text-base font-medium text-emerald-600 bg-white rounded-xl hover:bg-gray-50 transition-colors">
              무료 상담 신청
            </Link>
            <a href="tel:010-4289-4924" className="flex items-center gap-2 px-8 py-3.5 text-base font-medium text-white border-2 border-white/30 rounded-xl hover:bg-white/10 transition-colors">
              <Phone className="w-5 h-5" />
              010-4289-4924
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

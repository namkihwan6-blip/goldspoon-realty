"use client";

import { useEffect, useState, use } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { sampleProperties } from "@/lib/sample-data";
import { Property } from "@/types/property";
import { formatPrice, formatArea } from "@/lib/utils";
import Link from "next/link";
import { MapPin, Maximize, Tag, Calendar, ArrowLeft, Phone, Mail, Zap, Droplets, Flame, Truck, Building } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        // Try Firestore first
        const docRef = doc(db, "properties", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProperty({ id: docSnap.id, ...docSnap.data() } as Property);
        } else {
          // Fallback to sample data
          const sample = sampleProperties.find((p) => p.id === id);
          if (sample) {
            setProperty(sample);
          } else {
            setNotFound(true);
          }
        }
      } catch (err) {
        console.error("매물 로딩 실패:", err);
        // Fallback to sample data on error
        const sample = sampleProperties.find((p) => p.id === id);
        if (sample) {
          setProperty(sample);
        } else {
          setNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="pt-16 min-h-screen bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="text-center py-20">
              <div className="w-12 h-12 border-[3px] border-gray-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-xl text-gray-500">매물 정보를 불러오는 중...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (notFound || !property) {
    return (
      <>
        <Header />
        <main className="pt-16 min-h-screen bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">매물을 찾을 수 없습니다</h2>
              <Link href="/properties/land" className="text-emerald-600 hover:text-emerald-700 text-lg underline">
                매물 목록으로 돌아가기
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="pt-16 min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Back link */}
          <Link
            href={property.type === "land" ? "/properties/land" : "/properties/factory"}
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-emerald-600 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            목록으로 돌아가기
          </Link>

          {/* Image area */}
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-72 sm:h-96 rounded-2xl flex items-center justify-center mb-8">
            <span className="text-gray-400 text-lg">매물 이미지</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title & status */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full text-white ${property.status === "available" ? "bg-emerald-500" : property.status === "reserved" ? "bg-amber-500" : "bg-gray-500"}`}>
                    {property.status === "available" ? "매물" : property.status === "reserved" ? "예약중" : "거래완료"}
                  </span>
                  <span className="px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-full">
                    {property.type === "land" ? "토지" : "공장"}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                <div className="flex items-center gap-1.5 text-gray-500">
                  <MapPin className="w-4 h-4" />
                  {property.address} {property.addressDetail || ""}
                </div>
              </div>

              {/* Price */}
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">매매가</p>
                <p className="text-3xl font-bold text-emerald-600">
                  {formatPrice(property.price)}
                  {property.priceUnit === "per-pyeong" && <span className="text-base text-gray-400 ml-1">/평</span>}
                </p>
              </div>

              {/* Description */}
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">매물 설명</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{property.description}</p>
              </div>

              {/* Details */}
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">상세 정보</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Maximize className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500">대지면적</span>
                    <span className="ml-auto font-medium text-gray-900">{formatArea(property.area)}</span>
                  </div>
                  {property.buildingArea ? (
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-500">건물면적</span>
                      <span className="ml-auto font-medium text-gray-900">{formatArea(property.buildingArea)}</span>
                    </div>
                  ) : null}
                  {property.zoning && (
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-500">용도지역</span>
                      <span className="ml-auto font-medium text-gray-900">{property.zoning}</span>
                    </div>
                  )}
                  {property.landUse && (
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-500">지목</span>
                      <span className="ml-auto font-medium text-gray-900">{property.landUse}</span>
                    </div>
                  )}
                  {property.floorAreaRatio != null && property.floorAreaRatio > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">용적률</span>
                      <span className="ml-auto font-medium text-gray-900">{property.floorAreaRatio}%</span>
                    </div>
                  )}
                  {property.buildingCoverageRatio != null && property.buildingCoverageRatio > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">건폐율</span>
                      <span className="ml-auto font-medium text-gray-900">{property.buildingCoverageRatio}%</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500">등록일</span>
                    <span className="ml-auto font-medium text-gray-900">{property.createdAt}</span>
                  </div>
                </div>
              </div>

              {/* Factory details */}
              {property.type === "factory" && (
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">공장 시설 정보</h2>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {property.factoryType && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">공장유형</span>
                        <span className="ml-auto font-medium text-gray-900">{property.factoryType}</span>
                      </div>
                    )}
                    {property.ceilingHeight ? (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">천장높이</span>
                        <span className="ml-auto font-medium text-gray-900">{property.ceilingHeight}m</span>
                      </div>
                    ) : null}
                    {property.electricity && (
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-500">전력</span>
                        <span className="ml-auto font-medium text-gray-900">{property.electricity}</span>
                      </div>
                    )}
                    {property.yearBuilt ? (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">준공연도</span>
                        <span className="ml-auto font-medium text-gray-900">{property.yearBuilt}년</span>
                      </div>
                    ) : null}
                    <div className="flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-500">급수</span>
                      <span className="ml-auto font-medium text-gray-900">{property.waterSupply ? "있음" : "없음"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-500">가스</span>
                      <span className="ml-auto font-medium text-gray-900">{property.gasSupply ? "있음" : "없음"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-500">하역장</span>
                      <span className="ml-auto font-medium text-gray-900">{property.loadingDock ? "있음" : "없음"}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Features */}
              {property.features && property.features.length > 0 && (
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">특징</h2>
                  <div className="flex flex-wrap gap-2">
                    {property.features.map((f) => (
                      <span key={f} className="px-3 py-1.5 text-sm text-emerald-700 bg-emerald-50 rounded-lg">{f}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar: Contact */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">매물 문의</h3>
                <p className="text-sm text-gray-500 mb-6">이 매물에 관심이 있으시면 연락주세요. 친절하게 안내해드립니다.</p>

                <a
                  href="tel:010-4289-4924"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors mb-3"
                >
                  <Phone className="w-5 h-5" />
                  전화 상담
                </a>
                <a
                  href="mailto:goldspoon02@naver.com"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors mb-3"
                >
                  <Mail className="w-5 h-5" />
                  이메일 문의
                </a>
                <Link
                  href="/contact"
                  className="flex items-center justify-center w-full py-3 border border-emerald-200 text-emerald-600 rounded-xl font-medium hover:bg-emerald-50 transition-colors"
                >
                  상담 신청서 작성
                </Link>

                <div className="mt-6 pt-6 border-t border-gray-100 text-sm text-gray-500">
                  <p className="font-medium text-gray-900 mb-2">금수저공인중개사 사무소</p>
                  <p>대표: 홍길동</p>
                  <p>등록번호: 제 45130-2017-00031호</p>
                  <p className="mt-2">010-4289-4924</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

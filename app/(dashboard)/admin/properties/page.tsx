"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/admin-layout";
import { Property } from "@/types/property";
import { db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  MapPin,
  Factory,
  Landmark,
} from "lucide-react";

const statusLabels: Record<string, { label: string; className: string }> = {
  available: {
    label: "판매중",
    className: "bg-green-100 text-green-800 border-green-300",
  },
  reserved: {
    label: "예약중",
    className: "bg-yellow-100 text-yellow-800 border-yellow-300",
  },
  sold: {
    label: "판매완료",
    className: "bg-gray-100 text-gray-600 border-gray-300",
  },
};

function formatPrice(price: number, unit: string): string {
  if (unit === "per-pyeong") {
    return `평당 ${(price / 10000).toLocaleString()}만원`;
  }
  if (price >= 100000000) {
    const eok = Math.floor(price / 100000000);
    const remainder = price % 100000000;
    if (remainder === 0) return `${eok}억원`;
    return `${eok}억 ${(remainder / 10000).toLocaleString()}만원`;
  }
  return `${(price / 10000).toLocaleString()}만원`;
}

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    try {
      const q = query(collection(db, "properties"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Property[];
      setProperties(data);
    } catch (err) {
      console.error("매물 로딩 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const filtered = properties.filter(
    (p) =>
      p.title.includes(searchTerm) ||
      p.address.includes(searchTerm)
  );

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`"${title}" 매물을 정말 삭제하시겠습니까?`)) {
      try {
        await deleteDoc(doc(db, "properties", id));
        setProperties((prev) => prev.filter((p) => p.id !== id));
      } catch (err) {
        console.error("삭제 실패:", err);
        alert("매물 삭제에 실패했습니다.");
      }
    }
  };

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">매물 관리</h1>
          <p className="text-xl text-gray-500 mt-1">
            총 {filtered.length}건의 매물
          </p>
        </div>
        <Link
          href="/admin/properties/new"
          className="flex items-center gap-3 h-14 px-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xl font-bold rounded-xl transition-colors shadow-lg shadow-emerald-200"
        >
          <Plus className="w-7 h-7" />
          새 매물 등록
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="매물 제목 또는 주소로 검색..."
          className="w-full h-14 pl-14 pr-4 text-lg border-2 border-gray-300 rounded-xl focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-colors"
        />
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border-2 border-gray-200 p-6 animate-pulse">
              <div className="flex gap-3 mb-3">
                <div className="h-8 w-16 bg-gray-200 rounded-full" />
                <div className="h-8 w-16 bg-gray-200 rounded-full" />
              </div>
              <div className="h-6 w-64 bg-gray-200 rounded mb-2" />
              <div className="h-5 w-48 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      ) : (
        /* Property List */
        <div className="space-y-4">
          {filtered.map((property) => {
            const status = statusLabels[property.status] || statusLabels.available;
            return (
              <div
                key={property.id}
                className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-emerald-300 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Property Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      {/* Type Badge */}
                      <span
                        className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-base font-bold border ${
                          property.type === "land"
                            ? "bg-amber-50 text-amber-800 border-amber-300"
                            : "bg-blue-50 text-blue-800 border-blue-300"
                        }`}
                      >
                        {property.type === "land" ? (
                          <Landmark className="w-5 h-5" />
                        ) : (
                          <Factory className="w-5 h-5" />
                        )}
                        {property.type === "land" ? "토지" : "공장"}
                      </span>

                      {/* Status Badge */}
                      <span
                        className={`px-4 py-1.5 rounded-full text-base font-bold border ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-gray-900 mb-1 truncate">
                      {property.title}
                    </h2>

                    {/* Address + Price */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-lg text-gray-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        {property.address}
                      </span>
                      <span className="hidden sm:inline text-gray-300">|</span>
                      <span className="font-bold text-emerald-700">
                        {formatPrice(property.price, property.priceUnit)}
                      </span>
                      <span className="hidden sm:inline text-gray-300">|</span>
                      <span>{property.area}평</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 shrink-0">
                    <Link
                      href={`/admin/properties/new?edit=${property.id}`}
                      className="flex items-center gap-2 h-12 px-6 bg-blue-50 hover:bg-blue-100 text-blue-700 text-lg font-bold rounded-xl border-2 border-blue-200 transition-colors"
                    >
                      <Pencil className="w-5 h-5" />
                      수정
                    </Link>
                    <button
                      onClick={() => handleDelete(property.id, property.title)}
                      className="flex items-center gap-2 h-12 px-6 bg-red-50 hover:bg-red-100 text-red-700 text-lg font-bold rounded-xl border-2 border-red-200 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-2xl text-gray-400">
                {properties.length === 0
                  ? "등록된 매물이 없습니다. 대시보드에서 샘플 데이터를 생성하거나 새 매물을 등록하세요."
                  : "검색 결과가 없습니다"}
              </p>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}

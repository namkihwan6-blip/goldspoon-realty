"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/admin-layout";
import { db } from "@/lib/firebase";
import { collection, getDocs, updateDoc, doc, orderBy, query } from "firebase/firestore";
import {
  Phone,
  Calendar,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  User,
} from "lucide-react";

interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  propertyType: string;
  budget?: string;
  area?: string;
  message: string;
  createdAt: string;
  status: "pending" | "completed";
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const q = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Inquiry[];
        setInquiries(data);
      } catch (err) {
        console.error("상담 문의 로딩 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  const pendingCount = inquiries.filter(
    (i) => i.status === "pending"
  ).length;

  const toggleStatus = async (id: string) => {
    const inquiry = inquiries.find((i) => i.id === id);
    if (!inquiry) return;

    const newStatus = inquiry.status === "pending" ? "completed" : "pending";

    try {
      await updateDoc(doc(db, "inquiries", id), { status: newStatus });
      setInquiries((prev) =>
        prev.map((inq) =>
          inq.id === id
            ? { ...inq, status: newStatus as "pending" | "completed" }
            : inq
        )
      );
    } catch (err) {
      console.error("상태 변경 실패:", err);
      alert("상태 변경에 실패했습니다.");
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const propertyTypeLabel = (type: string) => {
    if (type === "land") return "토지";
    if (type === "factory") return "공장";
    if (type === "both") return "토지+공장";
    return type;
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("ko-KR");
    } catch {
      return dateStr;
    }
  };

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">상담 문의 관리</h1>
        <p className="text-xl text-gray-500 mt-1">
          총 {inquiries.length}건 ·{" "}
          <span className="text-orange-600 font-bold">
            대기 {pendingCount}건
          </span>
        </p>
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
              <div className="h-6 w-48 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      ) : inquiries.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-2xl text-gray-400">접수된 상담 문의가 없습니다</p>
        </div>
      ) : (
        /* Inquiry List */
        <div className="space-y-4">
          {inquiries.map((inquiry) => {
            const isExpanded = expandedId === inquiry.id;
            const isPending = inquiry.status === "pending";

            return (
              <div
                key={inquiry.id}
                className={`bg-white rounded-2xl border-2 transition-colors ${
                  isPending
                    ? "border-orange-200"
                    : "border-gray-200 opacity-80"
                }`}
              >
                {/* Card Header - always visible */}
                <button
                  onClick={() => toggleExpand(inquiry.id)}
                  className="w-full p-6 text-left"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        {/* Status Badge */}
                        <span
                          className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-base font-bold border ${
                            isPending
                              ? "bg-orange-100 text-orange-800 border-orange-300"
                              : "bg-green-100 text-green-800 border-green-300"
                          }`}
                        >
                          {isPending ? (
                            <Clock className="w-5 h-5" />
                          ) : (
                            <CheckCircle2 className="w-5 h-5" />
                          )}
                          {isPending ? "대기" : "완료"}
                        </span>

                        {/* Property Type */}
                        <span className="px-4 py-1.5 rounded-full text-base font-bold bg-gray-100 text-gray-700 border border-gray-300">
                          {propertyTypeLabel(inquiry.propertyType)}
                        </span>

                        {/* Date */}
                        <span className="flex items-center gap-1 text-base text-gray-500">
                          <Calendar className="w-5 h-5" />
                          {formatDate(inquiry.createdAt)}
                        </span>
                      </div>

                      {/* Name + Phone */}
                      <div className="flex items-center gap-4 text-xl">
                        <span className="flex items-center gap-2 font-bold text-gray-900">
                          <User className="w-6 h-6 text-gray-400" />
                          {inquiry.name}
                        </span>
                        <span className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-5 h-5 text-gray-400" />
                          {inquiry.phone}
                        </span>
                      </div>
                    </div>

                    {/* Expand icon */}
                    <div className="text-gray-400">
                      {isExpanded ? (
                        <ChevronUp className="w-7 h-7" />
                      ) : (
                        <ChevronDown className="w-7 h-7" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-6 pb-6 border-t-2 border-gray-100 pt-4">
                    {/* Message */}
                    <div className="mb-6">
                      <p className="text-lg font-semibold text-gray-700 mb-2">
                        문의 내용
                      </p>
                      <div className="bg-gray-50 rounded-xl p-5 text-lg text-gray-800 leading-relaxed">
                        {inquiry.message || "(내용 없음)"}
                      </div>
                    </div>

                    {/* Email + Budget + Area */}
                    <div className="space-y-1 mb-6">
                      <p className="text-lg text-gray-600">
                        이메일: {inquiry.email || "-"}
                      </p>
                      {inquiry.budget && (
                        <p className="text-lg text-gray-600">
                          예산: {inquiry.budget}
                        </p>
                      )}
                      {inquiry.area && (
                        <p className="text-lg text-gray-600">
                          희망면적: {inquiry.area}
                        </p>
                      )}
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => toggleStatus(inquiry.id)}
                      className={`flex items-center gap-3 h-14 px-8 text-xl font-bold rounded-xl transition-colors ${
                        isPending
                          ? "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200"
                          : "bg-orange-100 hover:bg-orange-200 text-orange-800 border-2 border-orange-300"
                      }`}
                    >
                      {isPending ? (
                        <>
                          <CheckCircle2 className="w-6 h-6" />
                          완료 처리
                        </>
                      ) : (
                        <>
                          <Clock className="w-6 h-6" />
                          대기로 변경
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/admin-layout";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { seedProperties } from "@/lib/seed-firestore";
import {
  Home,
  MessageSquare,
  Users,
  BarChart3,
  ArrowRight,
  Database,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalProperties: 0,
    pendingInquiries: 0,
    totalMembers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [propertiesSnap, inquiriesSnap, usersSnap] = await Promise.all([
          getDocs(collection(db, "properties")),
          getDocs(query(collection(db, "inquiries"), where("status", "==", "pending"))),
          getDocs(collection(db, "users")),
        ]);

        setStats({
          totalProperties: propertiesSnap.size,
          pendingInquiries: inquiriesSnap.size,
          totalMembers: usersSnap.size,
        });
      } catch (err) {
        console.error("통계 로딩 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleSeed = async () => {
    if (!window.confirm("샘플 매물 데이터를 Firestore에 생성하시겠습니까?")) return;
    setSeeding(true);
    setSeedMessage("");
    try {
      const count = await seedProperties();
      setSeedMessage(`${count}건의 샘플 데이터가 생성되었습니다.`);
      // Refresh stats
      const propertiesSnap = await getDocs(collection(db, "properties"));
      setStats((prev) => ({ ...prev, totalProperties: propertiesSnap.size }));
    } catch (err: unknown) {
      setSeedMessage((err as Error).message || "데이터 생성 실패");
    } finally {
      setSeeding(false);
    }
  };

  const tiles = [
    {
      href: "/admin/properties",
      icon: Home,
      label: "매물 관리",
      description: "토지·공장 매물 등록 및 관리",
      count: stats.totalProperties,
      countLabel: "건",
      color: "bg-blue-50 text-blue-700 border-blue-200",
      iconColor: "text-blue-600",
    },
    {
      href: "/admin/inquiries",
      icon: MessageSquare,
      label: "상담 문의 관리",
      description: "고객 상담 요청 확인 및 처리",
      count: stats.pendingInquiries,
      countLabel: "건 대기",
      color: "bg-orange-50 text-orange-700 border-orange-200",
      iconColor: "text-orange-600",
    },
    {
      href: "#",
      icon: Users,
      label: "회원 관리",
      description: "가입 회원 목록 및 정보 관리",
      count: stats.totalMembers,
      countLabel: "명",
      color: "bg-purple-50 text-purple-700 border-purple-200",
      iconColor: "text-purple-600",
    },
    {
      href: "#",
      icon: BarChart3,
      label: "통계",
      description: "방문자 및 매물 조회 통계",
      count: 0,
      countLabel: "",
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      iconColor: "text-emerald-600",
    },
  ];

  return (
    <AdminLayout>
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="text-xl text-gray-500 mt-2">
          금수저공인중개사 사무소 관리 페이지입니다
        </p>
      </div>

      {/* Top Stats */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border-2 border-gray-200 p-6 text-center animate-pulse">
              <div className="h-5 bg-gray-200 rounded mx-auto w-20 mb-3" />
              <div className="h-10 bg-gray-200 rounded mx-auto w-16" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 text-center">
            <p className="text-lg font-semibold text-gray-500 mb-1">총 매물</p>
            <p className="text-4xl font-bold text-gray-900">
              {stats.totalProperties}
              <span className="text-xl text-gray-500 ml-1">건</span>
            </p>
          </div>
          <div className="bg-white rounded-2xl border-2 border-orange-300 p-6 text-center">
            <p className="text-lg font-semibold text-gray-500 mb-1">상담 대기</p>
            <p className="text-4xl font-bold text-orange-600">
              {stats.pendingInquiries}
              <span className="text-xl text-gray-500 ml-1">건</span>
            </p>
          </div>
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 text-center">
            <p className="text-lg font-semibold text-gray-500 mb-1">회원수</p>
            <p className="text-4xl font-bold text-gray-900">
              {stats.totalMembers}
              <span className="text-xl text-gray-500 ml-1">명</span>
            </p>
          </div>
        </div>
      )}

      {/* Seed Data Button */}
      <div className="mb-10 bg-white rounded-2xl border-2 border-dashed border-gray-300 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Database className="w-6 h-6 text-gray-500" />
              샘플 데이터 관리
            </h3>
            <p className="text-lg text-gray-500 mt-1">Firestore에 샘플 매물 데이터를 생성합니다</p>
            {seedMessage && (
              <p className="text-lg font-semibold text-emerald-600 mt-2">{seedMessage}</p>
            )}
          </div>
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="flex items-center gap-3 h-14 px-8 bg-gray-800 hover:bg-gray-900 text-white text-xl font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {seeding ? (
              <div className="w-6 h-6 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Database className="w-6 h-6" />
            )}
            샘플 데이터 생성
          </button>
        </div>
      </div>

      {/* Navigation Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {tiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <Link
              key={tile.label}
              href={tile.href}
              className={`block rounded-2xl border-2 p-8 transition-all hover:shadow-lg hover:-translate-y-1 ${tile.color}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <Icon className={`w-8 h-8 ${tile.iconColor}`} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{tile.label}</h2>
                    <p className="text-base opacity-80 mt-1">
                      {tile.description}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-7 h-7 opacity-60 mt-2" />
              </div>
              {tile.count > 0 && (
                <div className="text-right">
                  <span className="text-4xl font-bold">{tile.count}</span>
                  <span className="text-xl ml-1">{tile.countLabel}</span>
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </AdminLayout>
  );
}

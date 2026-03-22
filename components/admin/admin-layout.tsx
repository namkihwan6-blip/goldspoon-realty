"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  LayoutDashboard,
  Home,
  MessageSquare,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "대시보드", icon: LayoutDashboard },
  { href: "/admin/properties", label: "매물관리", icon: Home },
  { href: "/admin/inquiries", label: "상담관리", icon: MessageSquare },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const handleLogout = () => {
    console.log("로그아웃 처리");
    // TODO: Firebase auth signOut
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b-2 border-emerald-600 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo + Admin Label */}
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-emerald-600" />
              <div>
                <span className="text-xl font-bold text-gray-900">
                  새만금<span className="text-emerald-600">부동산</span>
                </span>
                <span className="ml-3 text-lg font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                  관리자 페이지
                </span>
              </div>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin" &&
                    pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl text-lg font-semibold transition-colors ${
                      isActive
                        ? "bg-emerald-600 text-white"
                        : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-3 text-lg font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut className="w-6 h-6" />
              로그아웃
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden border-t border-gray-200 px-4 py-3 flex gap-2 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-base font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-emerald-600 text-white"
                    : "text-gray-700 hover:bg-emerald-50"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

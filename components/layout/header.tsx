"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Building2, Phone, User, LogOut, Shield, LogIn, UserPlus } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [role, setRole] = useState<"user" | "admin">("user");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            setRole(userDoc.data().role || "user");
          }
        } catch {
          setRole("user");
        }
      } else {
        setRole("user");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUserMenuOpen(false);
    router.push("/");
  };

  const navLinks = [
    { href: "/", label: "홈" },
    { href: "/properties/land", label: "토지매물" },
    { href: "/properties/factory", label: "공장매물" },
    { href: "/pricing", label: "이용요금" },
    { href: "/about", label: "회사소개" },
    { href: "/contact", label: "상담문의" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Building2 className="w-7 h-7 text-emerald-600" />
            <span className="text-xl font-bold text-gray-900">
              금수저<span className="text-emerald-600">공인중개사 사무소</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="tel:010-4289-4924"
              className="flex items-center gap-1.5 text-sm text-gray-600"
            >
              <Phone className="w-4 h-4" />
              010-4289-4924
            </a>

            {user ? (
              /* 로그인 상태 */
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <User className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user.displayName || user.email?.split("@")[0]}
                  </span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    {role === "admin" ? (
                      <Link
                        href="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Shield className="w-4 h-4 text-amber-500" />
                        관리자 페이지
                      </Link>
                    ) : (
                      <Link
                        href="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <User className="w-4 h-4 text-emerald-600" />
                        마이페이지
                      </Link>
                    )}
                    {role === "admin" && (
                      <Link
                        href="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <User className="w-4 h-4 text-emerald-600" />
                        마이페이지
                      </Link>
                    )}
                    <div className="border-t border-gray-100 my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* 비로그인 상태 */
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  로그인
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  회원가입
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <nav className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 text-base font-medium text-gray-700 rounded-lg hover:bg-gray-50"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="border-t border-gray-100 my-3" />

            {user ? (
              <>
                <div className="px-3 py-2 text-sm text-gray-500">
                  {user.displayName || user.email}
                </div>
                {role === "admin" && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 px-3 py-2 text-base font-medium text-amber-700 rounded-lg hover:bg-amber-50"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Shield className="w-5 h-5" />
                    관리자 페이지
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-3 py-2 text-base font-medium text-gray-700 rounded-lg hover:bg-gray-50"
                  onClick={() => setMobileOpen(false)}
                >
                  <User className="w-5 h-5" />
                  마이페이지
                </Link>
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2 text-base font-medium text-red-600 rounded-lg hover:bg-red-50 w-full"
                >
                  <LogOut className="w-5 h-5" />
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-3 py-2 text-base font-medium text-gray-700 rounded-lg hover:bg-gray-50"
                  onClick={() => setMobileOpen(false)}
                >
                  <LogIn className="w-5 h-5" />
                  로그인
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 text-base font-medium text-white bg-emerald-600 rounded-lg text-center mt-2"
                  onClick={() => setMobileOpen(false)}
                >
                  회원가입
                </Link>
              </>
            )}
          </nav>
        </div>
      )}

      {/* 배경 클릭 시 유저 메뉴 닫기 */}
      {userMenuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
      )}
    </header>
  );
}

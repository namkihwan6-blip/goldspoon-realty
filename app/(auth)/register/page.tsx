"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { User, Mail, Phone, Lock, UserPlus } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (form.password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;

      // Update display name in Firebase Auth
      await updateProfile(user, { displayName: form.name });

      // Save user profile to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: form.email,
        displayName: form.name,
        phone: form.phone,
        role: "user",
        createdAt: new Date().toISOString(),
      });

      router.push("/");
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (code === "auth/email-already-in-use") {
        setError("이미 사용 중인 이메일입니다.");
      } else if (code === "auth/weak-password") {
        setError("비밀번호가 너무 약합니다. 6자 이상으로 설정해주세요.");
      } else if (code === "auth/invalid-email") {
        setError("유효하지 않은 이메일 형식입니다.");
      } else {
        setError("회원가입 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-24 pb-16 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-10">
            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">회원가입</h1>
              <p className="text-lg text-gray-500">
                간단한 정보를 입력하고 가입하세요
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="flex items-center gap-2 text-xl font-semibold text-gray-800 mb-2">
                  <User className="w-6 h-6 text-emerald-600" />
                  이름
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="홍길동"
                  className="w-full h-14 px-4 text-lg border-2 border-gray-300 rounded-xl focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-colors"
                  required
                  disabled={loading}
                />
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-xl font-semibold text-gray-800 mb-2">
                  <Mail className="w-6 h-6 text-emerald-600" />
                  이메일
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="example@email.com"
                  className="w-full h-14 px-4 text-lg border-2 border-gray-300 rounded-xl focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-colors"
                  required
                  disabled={loading}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center gap-2 text-xl font-semibold text-gray-800 mb-2">
                  <Phone className="w-6 h-6 text-emerald-600" />
                  전화번호
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="010-0000-0000"
                  className="w-full h-14 px-4 text-lg border-2 border-gray-300 rounded-xl focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-colors"
                  required
                  disabled={loading}
                />
              </div>

              {/* Password */}
              <div>
                <label className="flex items-center gap-2 text-xl font-semibold text-gray-800 mb-2">
                  <Lock className="w-6 h-6 text-emerald-600" />
                  비밀번호
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  className="w-full h-14 px-4 text-lg border-2 border-gray-300 rounded-xl focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-colors"
                  required
                  disabled={loading}
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="flex items-center gap-2 text-xl font-semibold text-gray-800 mb-2">
                  <Lock className="w-6 h-6 text-emerald-600" />
                  비밀번호 확인
                </label>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  placeholder="비밀번호를 다시 입력하세요"
                  className="w-full h-14 px-4 text-lg border-2 border-gray-300 rounded-xl focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-colors"
                  required
                  disabled={loading}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xl font-bold rounded-xl transition-colors shadow-lg shadow-emerald-200 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-6 h-6 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-6 h-6" />
                    회원가입
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-sm text-gray-400">또는</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Google Register */}
            <button
              type="button"
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                setError("");
                try {
                  const provider = new GoogleAuthProvider();
                  const result = await signInWithPopup(auth, provider);
                  const user = result.user;
                  const userDoc = await getDoc(doc(db, "users", user.uid));
                  if (!userDoc.exists()) {
                    await setDoc(doc(db, "users", user.uid), {
                      uid: user.uid,
                      email: user.email,
                      displayName: user.displayName || "",
                      phone: "",
                      role: "user",
                      createdAt: new Date().toISOString(),
                    });
                  }
                  router.push("/");
                } catch (err: unknown) {
                  const code = (err as { code?: string })?.code;
                  if (code === "auth/popup-closed-by-user") return;
                  setError("구글 회원가입에 실패했습니다.");
                } finally {
                  setLoading(false);
                }
              }}
              className="w-full h-14 flex items-center justify-center gap-3 bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-700 text-lg font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              구글로 간편 가입
            </button>

            {/* Login Link */}
            <div className="mt-8 text-center">
              <p className="text-lg text-gray-500">
                이미 회원이신가요?
              </p>
              <Link
                href="/login"
                className="inline-block mt-2 text-xl font-semibold text-emerald-600 hover:text-emerald-700 underline underline-offset-4"
              >
                로그인하기
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

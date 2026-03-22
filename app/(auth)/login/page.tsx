"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Mail, Lock, LogIn } from "lucide-react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (code === "auth/user-not-found" || code === "auth/wrong-password" || code === "auth/invalid-credential") {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      } else if (code === "auth/too-many-requests") {
        setError("로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.");
      } else {
        setError("로그인 중 오류가 발생했습니다.");
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">로그인</h1>
              <p className="text-lg text-gray-500">
                금수저공인중개사 사무소에 오신 것을 환영합니다
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-xl font-semibold text-gray-800 mb-2">
                  <Mail className="w-6 h-6 text-emerald-600" />
                  이메일
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  className="w-full h-14 px-4 text-lg border-2 border-gray-300 rounded-xl focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-colors"
                  required
                  disabled={loading}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xl font-bold rounded-xl transition-colors shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-6 h-6 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-6 h-6" />
                    로그인
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

            {/* Google Login */}
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
                  // Firestore에 유저 정보 없으면 생성
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
                  setError("구글 로그인에 실패했습니다.");
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
              구글로 로그인
            </button>

            {/* Register Link */}
            <div className="mt-8 text-center">
              <p className="text-lg text-gray-500">
                아직 회원이 아니신가요?
              </p>
              <Link
                href="/register"
                className="inline-block mt-2 text-xl font-semibold text-emerald-600 hover:text-emerald-700 underline underline-offset-4"
              >
                회원가입하기
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc, collection, getDocs, query, where, orderBy } from "firebase/firestore";
import {
  User,
  Phone,
  Mail,
  Save,
  Clock,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phone: string;
  role: string;
  createdAt: string;
}

interface UserInquiry {
  id: string;
  propertyType: string;
  message: string;
  createdAt: string;
  status: "pending" | "completed";
}

export default function ProfilePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [userInquiries, setUserInquiries] = useState<UserInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      setUserId(user.uid);
      setUserEmail(user.email || "");

      try {
        // Load user profile
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data() as UserProfile;
          setName(data.displayName || "");
          setPhone(data.phone || "");
          setCreatedAt(data.createdAt || "");
        } else {
          setName(user.displayName || "");
        }

        // Load user inquiries by email
        if (user.email) {
          const q = query(
            collection(db, "inquiries"),
            where("email", "==", user.email),
            orderBy("createdAt", "desc")
          );
          const snapshot = await getDocs(q);
          const inquiries = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })) as UserInquiry[];
          setUserInquiries(inquiries);
        }
      } catch (err) {
        console.error("프로필 로딩 실패:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setSaving(true);
    try {
      await updateDoc(doc(db, "users", userId), {
        displayName: name,
        phone: phone,
      });
      alert("프로필이 저장되었습니다!");
    } catch (err) {
      console.error("프로필 저장 실패:", err);
      alert("프로필 저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
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

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 pt-24 pb-16 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center py-20">
              <div className="w-12 h-12 border-[3px] border-gray-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-xl text-gray-500">프로필을 불러오는 중...</p>
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
      <main className="min-h-screen bg-gray-50 pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Page Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-8">내 프로필</h1>

          {/* Profile Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              기본 정보
            </h2>
            <form onSubmit={handleSave} className="space-y-5">
              {/* Name */}
              <div>
                <label className="flex items-center gap-2 text-xl font-semibold text-gray-800 mb-2">
                  <User className="w-6 h-6 text-emerald-600" />
                  이름
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-14 px-4 text-lg border-2 border-gray-300 rounded-xl focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-colors"
                  required
                  disabled={saving}
                />
              </div>

              {/* Email (readonly) */}
              <div>
                <label className="flex items-center gap-2 text-xl font-semibold text-gray-800 mb-2">
                  <Mail className="w-6 h-6 text-emerald-600" />
                  이메일
                </label>
                <input
                  type="email"
                  value={userEmail}
                  readOnly
                  className="w-full h-14 px-4 text-lg border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="text-base text-gray-400 mt-1">
                  이메일은 변경할 수 없습니다
                </p>
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center gap-2 text-xl font-semibold text-gray-800 mb-2">
                  <Phone className="w-6 h-6 text-emerald-600" />
                  전화번호
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-14 px-4 text-lg border-2 border-gray-300 rounded-xl focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-colors"
                  required
                  disabled={saving}
                />
              </div>

              {/* Member since */}
              {createdAt && (
                <p className="text-lg text-gray-500">
                  가입일: {formatDate(createdAt)}
                </p>
              )}

              {/* Save Button */}
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-3 h-14 px-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xl font-bold rounded-xl transition-colors shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <div className="w-6 h-6 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-6 h-6" />
                )}
                저장하기
              </button>
            </form>
          </div>

          {/* Inquiry History */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="flex items-center gap-3 text-2xl font-bold text-gray-900 mb-6">
              <MessageSquare className="w-7 h-7 text-emerald-600" />
              내 상담 내역
            </h2>

            {userInquiries.length === 0 ? (
              <p className="text-xl text-gray-400 text-center py-8">
                상담 내역이 없습니다
              </p>
            ) : (
              <div className="space-y-4">
                {userInquiries.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    className="border-2 border-gray-200 rounded-xl p-5"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {propertyTypeLabel(inquiry.propertyType)} 상담
                        </h3>
                        <p className="text-base text-gray-500 mt-1">
                          {formatDate(inquiry.createdAt)}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-base font-bold border shrink-0 ${
                          inquiry.status === "pending"
                            ? "bg-orange-100 text-orange-800 border-orange-300"
                            : "bg-green-100 text-green-800 border-green-300"
                        }`}
                      >
                        {inquiry.status === "pending" ? (
                          <Clock className="w-4 h-4" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                        {inquiry.status === "pending" ? "대기중" : "완료"}
                      </span>
                    </div>
                    <p className="text-lg text-gray-600">{inquiry.message || "(내용 없음)"}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

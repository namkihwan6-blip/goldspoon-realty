import Link from "next/link";
import { Building2, MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-6 h-6 text-emerald-400" />
              <span className="text-lg font-bold text-white">
                금수저<span className="text-emerald-400">공인중개사 사무소</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              군산시 새만금 지역 토지 및 공장 전문 공인중개사무소.
              새만금 개발사업 관련 정확한 시세 분석과
              맞춤형 매물 추천으로 성공적인 투자를 돕겠습니다.
            </p>
            <p className="text-xs text-gray-500">
              공인중개사 등록번호: 제 45130-2017-00031호
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">매물 안내</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/properties/land" className="hover:text-emerald-400 transition-colors">토지 매물</Link></li>
              <li><Link href="/properties/factory" className="hover:text-emerald-400 transition-colors">공장 매물</Link></li>
              <li><Link href="/about" className="hover:text-emerald-400 transition-colors">회사 소개</Link></li>
              <li><Link href="/contact" className="hover:text-emerald-400 transition-colors">상담 문의</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">연락처</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-emerald-400" />
                전북특별자치도 군산시 새만금북로 534-5
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0 text-emerald-400" />
                010-4289-4924
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0 text-emerald-400" />
                goldspoon02@naver.com
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 shrink-0 text-emerald-400" />
                평일 09:00 ~ 18:00
              </li>
            </ul>
          </div>

          {/* Map placeholder */}
          <div>
            <h3 className="text-white font-semibold mb-4">오시는 길</h3>
            <div className="w-full h-36 rounded-lg overflow-hidden">
              <iframe
                src="https://maps.google.com/maps?q=%EC%A0%84%EB%B6%81%ED%8A%B9%EB%B3%84%EC%9E%90%EC%B9%98%EB%8F%84+%EA%B5%B0%EC%82%B0%EC%8B%9C+%EC%83%88%EB%A7%8C%EA%B8%88%EB%B6%81%EB%A1%9C+534-5&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="144"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-xs text-gray-500">
          <p>&copy; 2026 금수저공인중개사 사무소. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

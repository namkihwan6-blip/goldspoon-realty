import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Shield, TrendingUp, Users, Award, MapPin, Phone, Clock } from "lucide-react";

export const metadata = {
  title: "회사소개 | 금수저공인중개사 사무소",
  description: "군산시 새만금 지역 토지 및 공장 전문 공인중개사무소를 소개합니다.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="pt-16 min-h-screen">
        {/* Hero */}
        <section className="bg-gradient-to-br from-emerald-600 to-emerald-800 py-24 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">금수저공인중개사 사무소</h1>
            <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
              군산·새만금 지역 토지·공장 전문 중개로 고객 여러분의 성공적인 부동산 투자를 돕고 있습니다.
            </p>
          </div>
        </section>

        {/* About content */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">새만금의 미래를 함께하는<br />부동산 전문 파트너</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  금수저공인중개사 사무소는 전북특별자치도 군산시를 중심으로 새만금 개발지역 토지 및 공장 매매·임대 전문 중개 서비스를 제공합니다.
                </p>
                <p className="text-gray-600 leading-relaxed mb-4">
                  새만금 개발사업 현황, 토지이용계획, 산업단지 분양 정보 등 새만금 특화 전문 컨설팅으로 고객 여러분의 최적의 투자 결정을 돕겠습니다.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  군산 국가산업단지, 새만금 산업용지, 관광레저용지, 농생명용지 등 다양한 용도의 매물을 현장 실사를 거쳐 제공합니다.
                </p>
              </div>
              <div className="bg-gray-100 rounded-2xl h-80 flex items-center justify-center text-gray-400">
                사무소 사진
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-14">핵심 가치</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Shield, title: "신뢰", desc: "정직한 정보 제공과 투명한 거래를 약속합니다." },
                { icon: TrendingUp, title: "새만금 전문", desc: "새만금 개발사업에 특화된 전문 지식과 경험." },
                { icon: Users, title: "고객 중심", desc: "고객의 투자 목적에 맞는 맞춤 서비스." },
                { icon: Award, title: "책임", desc: "계약 후에도 사후관리까지 책임집니다." },
              ].map((v) => (
                <div key={v.title} className="text-center p-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-50 rounded-xl mb-4">
                    <v.icon className="w-7 h-7 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{v.title}</h3>
                  <p className="text-sm text-gray-500">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-14">사무소 안내</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-8 rounded-xl border border-gray-100">
                <MapPin className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">주소</h3>
                <p className="text-sm text-gray-500">전북특별자치도 군산시 새만금북로 534-5</p>
              </div>
              <div className="text-center p-8 rounded-xl border border-gray-100">
                <Phone className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">전화</h3>
                <p className="text-sm text-gray-500">010-4289-4924</p>
              </div>
              <div className="text-center p-8 rounded-xl border border-gray-100">
                <Clock className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">영업시간</h3>
                <p className="text-sm text-gray-500">평일 09:00 ~ 18:00</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

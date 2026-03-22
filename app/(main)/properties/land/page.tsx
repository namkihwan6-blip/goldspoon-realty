"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import PropertyList from "@/components/property/property-list";
import { sampleProperties } from "@/lib/sample-data";
import { Property } from "@/types/property";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";

export default function LandPage() {
  const [properties, setProperties] = useState<Property[]>(sampleProperties);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const q = query(
          collection(db, "properties"),
          where("type", "==", "land"),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Property[];
          setProperties(data);
        }
        // If empty, keep sampleProperties as fallback
      } catch (err) {
        console.error("토지 매물 로딩 실패:", err);
        // Keep sampleProperties as fallback
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <>
      <Header />
      <div className="pt-16">
        {loading ? (
          <section className="py-20 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">토지 매물</h1>
                <p className="text-gray-500 text-lg">새만금 산업용지, 관광레저용지, 농생명용지 등 군산·김제 지역 토지 매물</p>
              </div>
              <div className="text-center py-10">
                <div className="w-12 h-12 border-[3px] border-gray-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-lg text-gray-500">매물을 불러오는 중...</p>
              </div>
            </div>
          </section>
        ) : (
          <PropertyList
            properties={properties}
            type="land"
            title="토지 매물"
            subtitle="새만금 산업용지, 관광레저용지, 농생명용지 등 군산·김제 지역 토지 매물"
          />
        )}
      </div>
      <Footer />
    </>
  );
}

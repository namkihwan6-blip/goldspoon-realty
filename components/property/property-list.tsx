"use client";

import { useState } from "react";
import { Property, PropertyType } from "@/types/property";
import PropertyCard from "./property-card";
import { Search, SlidersHorizontal } from "lucide-react";

interface PropertyListProps {
  properties: Property[];
  type?: PropertyType;
  title: string;
  subtitle: string;
}

export default function PropertyList({ properties, type, title, subtitle }: PropertyListProps) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "price-asc" | "price-desc" | "area-asc">("latest");

  const filtered = properties
    .filter((p) => (!type || p.type === type))
    .filter((p) =>
      !search ||
      p.title.includes(search) ||
      p.address.includes(search) ||
      p.features.some((f) => f.includes(search))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-asc": return a.price - b.price;
        case "price-desc": return b.price - a.price;
        case "area-asc": return b.area - a.area;
        default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">{title}</h1>
          <p className="text-gray-500 text-lg">{subtitle}</p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="지역, 키워드로 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="latest">최신순</option>
              <option value="price-asc">가격 낮은순</option>
              <option value="price-desc">가격 높은순</option>
              <option value="area-asc">면적 넓은순</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-6">
          총 <span className="font-semibold text-gray-900">{filtered.length}</span>건의 매물
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg mb-2">검색 결과가 없습니다</p>
            <p className="text-sm">다른 키워드로 검색해보세요</p>
          </div>
        )}
      </div>
    </section>
  );
}

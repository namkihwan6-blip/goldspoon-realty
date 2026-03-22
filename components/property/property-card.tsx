import Link from "next/link";
import { MapPin, Maximize, Factory, LandPlot, Tag } from "lucide-react";
import { Property } from "@/types/property";
import { formatPrice, formatArea } from "@/lib/utils";

export default function PropertyCard({ property }: { property: Property }) {
  const statusLabel = {
    available: "매물",
    reserved: "예약중",
    sold: "거래완료",
  };
  const statusColor = {
    available: "bg-emerald-500",
    reserved: "bg-amber-500",
    sold: "bg-gray-500",
  };

  return (
    <Link href={`/properties/${property.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        {/* Image placeholder */}
        <div className="relative h-52 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          {property.type === "land" ? (
            <LandPlot className="w-16 h-16 text-gray-300" />
          ) : (
            <Factory className="w-16 h-16 text-gray-300" />
          )}
          {/* Status badge */}
          <span className={`absolute top-3 left-3 px-2.5 py-1 text-xs font-medium text-white rounded-full ${statusColor[property.status]}`}>
            {statusLabel[property.status]}
          </span>
          {/* Type badge */}
          <span className="absolute top-3 right-3 px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-full">
            {property.type === "land" ? "토지" : "공장"}
          </span>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-1">
            {property.title}
          </h3>

          <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-3">
            <MapPin className="w-3.5 h-3.5" />
            {property.address}
          </div>

          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {property.description}
          </p>

          {/* Details */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <span className="flex items-center gap-1">
              <Maximize className="w-3.5 h-3.5" />
              {formatArea(property.area)}
            </span>
            {property.zoning && (
              <span className="flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                {property.zoning}
              </span>
            )}
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {property.features.slice(0, 3).map((f) => (
              <span key={f} className="px-2 py-0.5 text-xs text-gray-600 bg-gray-50 rounded-md">
                {f}
              </span>
            ))}
          </div>

          {/* Price */}
          <div className="pt-3 border-t border-gray-50">
            <span className="text-xl font-bold text-emerald-600">
              {formatPrice(property.price)}
            </span>
            {property.priceUnit === "per-pyeong" && (
              <span className="text-sm text-gray-400 ml-1">/평</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

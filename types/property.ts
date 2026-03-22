export type PropertyType = "land" | "factory";

export interface Property {
  id: string;
  type: PropertyType;
  title: string;
  description: string;
  price: number;
  priceUnit: "total" | "per-pyeong";
  address: string;
  addressDetail?: string;
  area: number; // 평
  buildingArea?: number; // 건물면적 (공장)
  zoning?: string; // 용도지역
  landUse?: string; // 토지이용
  floorAreaRatio?: number; // 용적률
  buildingCoverageRatio?: number; // 건폐율
  images: string[];
  features: string[];
  status: "available" | "reserved" | "sold";
  createdAt: string;
  updatedAt: string;
  // 공장 전용
  factoryType?: string; // 공장유형
  ceilingHeight?: number; // 천장높이
  electricity?: string; // 전력
  waterSupply?: boolean;
  gasSupply?: boolean;
  loadingDock?: boolean;
  yearBuilt?: number;
}

export interface PropertyFilter {
  type?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  region?: string;
  status?: string;
}

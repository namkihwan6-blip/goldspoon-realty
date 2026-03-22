"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/admin-layout";
import { PropertyType } from "@/types/property";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  Landmark,
  Factory,
  Save,
  ArrowLeft,
  MapPin,
  DollarSign,
  Ruler,
  FileText,
  Tag,
  Zap,
  Droplets,
  Flame,
  Truck,
  CalendarDays,
  Building,
  ImagePlus,
  X,
  Camera,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function NewPropertyPage() {
  const router = useRouter();
  const [propertyType, setPropertyType] = useState<PropertyType>("land");
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    title: "",
    address: "",
    price: "",
    priceUnit: "total" as "total" | "per-pyeong",
    area: "",
    buildingArea: "",
    description: "",
    zoning: "",
    features: "",
    // Factory fields
    factoryType: "",
    ceilingHeight: "",
    electricity: "",
    waterSupply: false,
    gasSupply: false,
    loadingDock: false,
    yearBuilt: "",
  });

  const handleChange = (
    field: string,
    value: string | boolean
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = 10 - imageFiles.length;
    const newFiles = files.slice(0, remaining);

    if (files.length > remaining) {
      alert(`최대 10장까지 업로드 가능합니다. ${remaining}장만 추가됩니다.`);
    }

    setImageFiles((prev) => [...prev, ...newFiles]);

    // Generate previews
    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (propertyId: string): Promise<string[]> => {
    const urls: string[] = [];
    for (let i = 0; i < imageFiles.length; i++) {
      setUploadProgress(`사진 업로드 중... (${i + 1}/${imageFiles.length})`);
      const file = imageFiles[i];
      const storageRef = ref(storage, `properties/${propertyId}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      urls.push(url);
    }
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const now = new Date().toISOString();
      const data = {
        type: propertyType,
        title: form.title,
        address: form.address,
        description: form.description,
        price: Number(form.price),
        priceUnit: form.priceUnit,
        area: Number(form.area),
        buildingArea: form.buildingArea ? Number(form.buildingArea) : 0,
        zoning: form.zoning,
        features: form.features
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean),
        images: [] as string[],
        status: "available" as const,
        factoryType: propertyType === "factory" ? form.factoryType : "",
        ceilingHeight: form.ceilingHeight ? Number(form.ceilingHeight) : 0,
        electricity: propertyType === "factory" ? form.electricity : "",
        waterSupply: form.waterSupply,
        gasSupply: form.gasSupply,
        loadingDock: form.loadingDock,
        yearBuilt: form.yearBuilt ? Number(form.yearBuilt) : 0,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await addDoc(collection(db, "properties"), data);

      // Upload images if any
      let imageUrls: string[] = [];
      if (imageFiles.length > 0) {
        imageUrls = await uploadImages(docRef.id);
      }

      // Update the document with id and image URLs
      await setDoc(doc(db, "properties", docRef.id), { ...data, id: docRef.id, images: imageUrls });

      alert("매물이 등록되었습니다!");
      router.push("/admin/properties");
    } catch (err) {
      console.error("매물 등록 실패:", err);
      alert("매물 등록에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full h-14 px-4 text-lg border-2 border-gray-300 rounded-xl focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-colors";
  const labelClass =
    "flex items-center gap-2 text-xl font-semibold text-gray-800 mb-2";

  return (
    <AdminLayout>
      {/* Back Button + Title */}
      <div className="mb-8">
        <Link
          href="/admin/properties"
          className="inline-flex items-center gap-2 text-lg text-gray-500 hover:text-emerald-600 mb-4 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
          매물 목록으로 돌아가기
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">새 매물 등록</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Property Type Selector */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">매물 유형</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setPropertyType("land")}
              className={`flex items-center justify-center gap-3 h-20 text-2xl font-bold rounded-xl border-3 transition-all ${
                propertyType === "land"
                  ? "bg-amber-50 text-amber-800 border-amber-500 shadow-lg"
                  : "bg-gray-50 text-gray-500 border-gray-300 hover:border-gray-400"
              }`}
            >
              <Landmark className="w-8 h-8" />
              토지
            </button>
            <button
              type="button"
              onClick={() => setPropertyType("factory")}
              className={`flex items-center justify-center gap-3 h-20 text-2xl font-bold rounded-xl border-3 transition-all ${
                propertyType === "factory"
                  ? "bg-blue-50 text-blue-800 border-blue-500 shadow-lg"
                  : "bg-gray-50 text-gray-500 border-gray-300 hover:border-gray-400"
              }`}
            >
              <Factory className="w-8 h-8" />
              공장
            </button>
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">기본 정보</h2>
          <div className="space-y-5">
            {/* Title */}
            <div>
              <label className={labelClass}>
                <FileText className="w-6 h-6 text-emerald-600" />
                매물 제목
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="예: 새만금 산업용지 투자 토지"
                className={inputClass}
                required
                disabled={loading}
              />
            </div>

            {/* Address */}
            <div>
              <label className={labelClass}>
                <MapPin className="w-6 h-6 text-emerald-600" />
                주소
              </label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="전북특별자치도 군산시..."
                className={inputClass}
                required
                disabled={loading}
              />
            </div>

            {/* Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>
                  <DollarSign className="w-6 h-6 text-emerald-600" />
                  가격 (원)
                </label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                  placeholder="450000000"
                  className={inputClass}
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className={labelClass}>
                  <Tag className="w-6 h-6 text-emerald-600" />
                  가격 단위
                </label>
                <select
                  value={form.priceUnit}
                  onChange={(e) => handleChange("priceUnit", e.target.value)}
                  className={inputClass}
                  disabled={loading}
                >
                  <option value="total">총액</option>
                  <option value="per-pyeong">평당</option>
                </select>
              </div>
            </div>

            {/* Area */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>
                  <Ruler className="w-6 h-6 text-emerald-600" />
                  면적 (평)
                </label>
                <input
                  type="number"
                  value={form.area}
                  onChange={(e) => handleChange("area", e.target.value)}
                  placeholder="500"
                  className={inputClass}
                  required
                  disabled={loading}
                />
              </div>
              {propertyType === "factory" && (
                <div>
                  <label className={labelClass}>
                    <Building className="w-6 h-6 text-emerald-600" />
                    건물면적 (평)
                  </label>
                  <input
                    type="number"
                    value={form.buildingArea}
                    onChange={(e) =>
                      handleChange("buildingArea", e.target.value)
                    }
                    placeholder="420"
                    className={inputClass}
                    disabled={loading}
                  />
                </div>
              )}
            </div>

            {/* Zoning */}
            <div>
              <label className={labelClass}>
                <Tag className="w-6 h-6 text-emerald-600" />
                용도지역
              </label>
              <input
                type="text"
                value={form.zoning}
                onChange={(e) => handleChange("zoning", e.target.value)}
                placeholder="예: 일반공업지역, 새만금 산업·연구용지"
                className={inputClass}
                disabled={loading}
              />
            </div>

            {/* Description */}
            <div>
              <label className={labelClass}>
                <FileText className="w-6 h-6 text-emerald-600" />
                상세 설명
              </label>
              <textarea
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="매물에 대한 상세 설명을 입력하세요..."
                rows={5}
                className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-colors resize-none"
                disabled={loading}
              />
            </div>

            {/* Features */}
            <div>
              <label className={labelClass}>
                <Tag className="w-6 h-6 text-emerald-600" />
                특징 (쉼표로 구분)
              </label>
              <input
                type="text"
                value={form.features}
                onChange={(e) => handleChange("features", e.target.value)}
                placeholder="예: 새만금, 산업용지, 투자적합, IC인접"
                className={inputClass}
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Camera className="w-7 h-7 text-emerald-600" />
            매물 사진
          </h2>
          <p className="text-lg text-gray-500 mb-6">최대 10장까지 업로드 가능합니다 ({imageFiles.length}/10)</p>

          {/* Preview Grid */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-6">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-gray-200">
                  <Image
                    src={preview}
                    alt={`미리보기 ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg opacity-80 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-center text-sm py-1">
                    {index + 1}번
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Upload Button */}
          {imageFiles.length < 10 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="w-full h-32 border-3 border-dashed border-gray-300 rounded-xl hover:border-emerald-400 hover:bg-emerald-50 transition-all flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ImagePlus className="w-10 h-10" />
              <span className="text-xl font-semibold">사진 추가하기</span>
              <span className="text-base">클릭하여 파일을 선택하세요</span>
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            className="hidden"
          />

          {uploadProgress && (
            <div className="mt-4 flex items-center gap-3 text-lg text-emerald-600">
              <div className="w-5 h-5 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
              {uploadProgress}
            </div>
          )}
        </div>

        {/* Factory-specific fields */}
        {propertyType === "factory" && (
          <div className="bg-white rounded-2xl border-2 border-blue-200 p-8">
            <h2 className="text-2xl font-bold text-blue-800 mb-6">
              공장 정보
            </h2>
            <div className="space-y-5">
              {/* Factory Type */}
              <div>
                <label className={labelClass}>
                  <Factory className="w-6 h-6 text-blue-600" />
                  공장 유형
                </label>
                <input
                  type="text"
                  value={form.factoryType}
                  onChange={(e) =>
                    handleChange("factoryType", e.target.value)
                  }
                  placeholder="예: 일반공장, 식품공장"
                  className={inputClass}
                  disabled={loading}
                />
              </div>

              {/* Ceiling Height + Electricity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    <Ruler className="w-6 h-6 text-blue-600" />
                    천장 높이 (m)
                  </label>
                  <input
                    type="number"
                    value={form.ceilingHeight}
                    onChange={(e) =>
                      handleChange("ceilingHeight", e.target.value)
                    }
                    placeholder="10"
                    className={inputClass}
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    <Zap className="w-6 h-6 text-blue-600" />
                    전력
                  </label>
                  <input
                    type="text"
                    value={form.electricity}
                    onChange={(e) =>
                      handleChange("electricity", e.target.value)
                    }
                    placeholder="예: 3상 300kW"
                    className={inputClass}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Year Built */}
              <div>
                <label className={labelClass}>
                  <CalendarDays className="w-6 h-6 text-blue-600" />
                  준공년도
                </label>
                <input
                  type="number"
                  value={form.yearBuilt}
                  onChange={(e) =>
                    handleChange("yearBuilt", e.target.value)
                  }
                  placeholder="2016"
                  className={inputClass}
                  disabled={loading}
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label className="flex items-center gap-3 h-16 px-5 bg-gray-50 rounded-xl border-2 border-gray-200 cursor-pointer hover:border-blue-300 transition-colors">
                  <input
                    type="checkbox"
                    checked={form.waterSupply}
                    onChange={(e) =>
                      handleChange("waterSupply", e.target.checked)
                    }
                    className="w-6 h-6 accent-blue-600"
                    disabled={loading}
                  />
                  <Droplets className="w-6 h-6 text-blue-500" />
                  <span className="text-lg font-semibold text-gray-700">
                    급수
                  </span>
                </label>
                <label className="flex items-center gap-3 h-16 px-5 bg-gray-50 rounded-xl border-2 border-gray-200 cursor-pointer hover:border-blue-300 transition-colors">
                  <input
                    type="checkbox"
                    checked={form.gasSupply}
                    onChange={(e) =>
                      handleChange("gasSupply", e.target.checked)
                    }
                    className="w-6 h-6 accent-blue-600"
                    disabled={loading}
                  />
                  <Flame className="w-6 h-6 text-orange-500" />
                  <span className="text-lg font-semibold text-gray-700">
                    가스
                  </span>
                </label>
                <label className="flex items-center gap-3 h-16 px-5 bg-gray-50 rounded-xl border-2 border-gray-200 cursor-pointer hover:border-blue-300 transition-colors">
                  <input
                    type="checkbox"
                    checked={form.loadingDock}
                    onChange={(e) =>
                      handleChange("loadingDock", e.target.checked)
                    }
                    className="w-6 h-6 accent-blue-600"
                    disabled={loading}
                  />
                  <Truck className="w-6 h-6 text-gray-500" />
                  <span className="text-lg font-semibold text-gray-700">
                    하역장
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-3 h-16 px-10 bg-emerald-600 hover:bg-emerald-700 text-white text-2xl font-bold rounded-xl transition-colors shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-7 h-7 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-7 h-7" />
            )}
            등록하기
          </button>
          <Link
            href="/admin/properties"
            className="flex items-center gap-3 h-16 px-10 bg-gray-100 hover:bg-gray-200 text-gray-700 text-2xl font-bold rounded-xl transition-colors border-2 border-gray-300"
          >
            취소
          </Link>
        </div>
      </form>
    </AdminLayout>
  );
}

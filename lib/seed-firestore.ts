import { db } from "@/lib/firebase";
import { collection, doc, setDoc, getDocs, query, limit } from "firebase/firestore";
import { sampleProperties } from "@/lib/sample-data";

export async function seedProperties(): Promise<number> {
  const propertiesRef = collection(db, "properties");

  // Check if data already exists
  const existingSnap = await getDocs(query(propertiesRef, limit(1)));
  if (!existingSnap.empty) {
    throw new Error("이미 데이터가 존재합니다. 기존 데이터를 삭제한 후 다시 시도해주세요.");
  }

  let count = 0;
  for (const property of sampleProperties) {
    const docRef = doc(propertiesRef, property.id);
    await setDoc(docRef, {
      ...property,
      createdAt: property.createdAt || new Date().toISOString(),
      updatedAt: property.updatedAt || new Date().toISOString(),
    });
    count++;
  }

  return count;
}

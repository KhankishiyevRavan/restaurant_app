// ✅ 2. src/types/product.ts

export type LangKey = "az" | "tr" | "en" | "ru" | "fr";

export interface Product {
  _id: string;
  name: Record<LangKey, string>;
  image?: string;
  price?: number | string;
  rating?: number;
  time?: string;
  category?: string;
  [key: string]: any;
}
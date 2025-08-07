// src/context/wishlistContext.tsx

import { createContext, useContext, useState, type ReactNode } from "react";

// 🔸 Məhsul üçün interfeys (istəyə uyğun genişləndirə bilərsən)
export type LangKey = "az" | "tr" | "en" | "ru" | "fr";

export interface Product {
  _id: string;
  name: Record<LangKey, string>; // ✅ string deyil, çoxdilli obyekt
  image: string;
  price: number;
  rating?: number;
  time?: string;
  [key: string]: any;
}
// 🔸 Context-in tipi
interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
}

// 🔸 Context yaradılır
const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

// 🔸 Provider komponenti
export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);

  const addToWishlist = (product: Product) => {
    // Eyni məhsul iki dəfə əlavə olunmasın deyə yoxlama əlavə edə bilərsən:
    const exists = wishlist.find((item) => item._id === product._id);
    if (!exists) {
      setWishlist((prev) => [...prev, product]);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

// 🔸 Hook: useWishlist
export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

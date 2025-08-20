// ✅ 1. src/service/wishlistService.ts

import type { Product } from "../types/product";


const WISHLIST_KEY = "wishlist";

export const getWishlist = (): Product[] => {
  try {
    const stored = localStorage.getItem(WISHLIST_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Wishlist oxunmadı:", e);
    return [];
  }
};

export const saveWishlist = (wishlist: Product[]) => {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
};

export const addToWishlist = (product: Product) => {
  const wishlist = getWishlist();
  const exists = wishlist.find((item) => item._id === product._id);
  if (!exists) {
    wishlist.push(product);
    saveWishlist(wishlist);
  }
};

export const removeFromWishlist = (productId: string) => {
  const wishlist = getWishlist().filter((item) => item._id !== productId);
  saveWishlist(wishlist);
};

export const isWished = (productId: string): boolean => {
  return getWishlist().some((item) => item._id === productId);
};

// ✅ 4. WishlistPage.tsx

import { getWishlist } from "../service/wishlistService";
import { useEffect, useState } from "react";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState(getWishlist());

  useEffect(() => {
    setWishlist(getWishlist());
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Sevilən məhsullar</h2>
      {wishlist.length === 0 ? (
        <p>Heç bir məhsul əlavə olunmayıb.</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {wishlist.map((item) => (
            <div key={item._id} className="border p-4 rounded-lg">
              <img
                src={`${import.meta.env.VITE_API_URL}${item.image}`}
                alt={item.name.az}
                className="h-40 object-cover"
              />
              <h3>{item.name.az}</h3>
              <p>{item.price} ₼</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

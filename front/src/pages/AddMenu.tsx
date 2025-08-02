import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createMenuItem } from "../service/menuService";

export default function AddMenu() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [time, setTime] = useState("");
  const [rating, setRating] = useState("");
  const [category, setCategory] = useState("All");
  const [image, setImage] = useState<File | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createMenuItem({
      name,
      price,
      time,
      rating: Number(rating),
      category,
      image: image || undefined,
    });

    // uğurla əlavə olunduqdan sonra menu səhifəsinə yönləndir
    navigate("/menu");
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">➕ Add New Menu Item</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-xl shadow"
      >
        <input
          type="text"
          placeholder="Name"
          className="border px-3 py-2 w-full rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Price"
          className="border px-3 py-2 w-full rounded"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Time (e.g. 20 min)"
          className="border px-3 py-2 w-full rounded"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />

        <input
          type="number"
          step="0.1"
          placeholder="Rating (1-5)"
          className="border px-3 py-2 w-full rounded"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border px-3 py-2 w-full rounded"
        >
          <option>All</option>
          <option>Breakfast</option>
          <option>Lunch</option>
          <option>Treats</option>
          <option>Dessert</option>
          <option>Drinks</option>
        </select>

        <input
          type="file"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="w-full"
        />

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          Save
        </button>
      </form>
    </div>
  );
}

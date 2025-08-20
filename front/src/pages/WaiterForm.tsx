import React, { useState } from "react";
import { createWaiter } from "../service/waiterService";

export default function WaiterForm({ onCreated }: { onCreated?: () => void }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim()) {
      setError("Zəhmət olmasa ofisiantın adını daxil edin.");
      return;
    }

    try {
      setLoading(true);
      await createWaiter({ name: name.trim(), isActive: true });
      setSuccess("Ofisiant uğurla əlavə olundu ✅");
      setName("");
      onCreated?.(); // siyahını yeniləmək üçün callback
    } catch (err: any) {
      setError(err?.message || "Naməlum xəta baş verdi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 rounded-2xl border shadow-sm bg-white space-y-4"
    >
      <h2 className="text-xl font-semibold">Yeni ofisiant əlavə et</h2>

      <div>
        <label className="block text-sm font-medium mb-1">Ad</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Məs: Əli Məmmədov"
          className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 text-red-700 px-3 py-2">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl bg-green-50 text-green-700 px-3 py-2">
          {success}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-yellow-500 text-white px-5 py-2.5 hover:bg-yellow-600 disabled:opacity-50"
      >
        {loading ? "Göndərilir..." : "Əlavə et"}
      </button>
    </form>
  );
}

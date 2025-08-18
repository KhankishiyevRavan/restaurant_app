import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listFeedback } from "../service/feedbackService";

// Sənin type-ın ola bilər, defansiv gedirik
type FeedbackItem = {
  _id?: string;
  id?: string;
  rating: number;
  waiterId?: string;
  waiter?: { _id?: string; id?: string; name?: string };
  waiterName?: string;
  message?: string;
  images?: (string | { url: string })[];
  createdAt?: string;
};

type Paginated<T> = {
  items?: T[];
  data?: T[];
  results?: T[];
  total?: number;
  page?: number;
  limit?: number;
  pages?: number;
};

const getId = (f: FeedbackItem) => f._id || f.id || "";
const getWaiterName = (f: FeedbackItem) =>
  f.waiter?.name || f.waiterName || "-";
const getImageUrl = (x: string | { url: string }) =>
  typeof x === "string" ? x : x?.url;

function Stars({ value }: { value: number }) {
  return (
    <span aria-label={`Rating ${value}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>{i < value ? "★" : "☆"}</span>
      ))}
    </span>
  );
}

export default function FeedbackListPage() {
  const navigate = useNavigate();

  const [rows, setRows] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // sadə pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState<number>(0);

  const pages = useMemo(() => {
    if (!total || !limit) return 1;
    return Math.max(1, Math.ceil(total / limit));
  }, [total, limit]);

  const load = async (p = page, l = limit) => {
    setLoading(true);
    setErr(null);
    try {
      const data = (await listFeedback({
        page: p,
        limit: l,
      })) as Paginated<FeedbackItem>;

      const items = data.items ?? data.data ?? data.results ?? [];

      setRows(items);

      // serverdən hansını qaytarırsansa, ona uyğun normalize
      setTotal(
        typeof data.total === "number"
          ? data.total
          : Array.isArray(items)
          ? items.length
          : 0
      );
    } catch (e: any) {
      setErr(e?.message || "Məlumat yüklənmədi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(page, limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Müştəri rəyləri</h1>

        <div className="flex items-center gap-2">
          <select
            value={limit}
            onChange={(e) => {
              setPage(1);
              setLimit(Number(e.target.value) || 10);
            }}
            className="rounded-xl border px-3 py-2"
            title="Səhifə ölçüsü"
          >
            {[10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}/səh.
              </option>
            ))}
          </select>

          <button
            onClick={() => load()}
            className="rounded-xl border px-4 py-2 hover:bg-gray-50"
            disabled={loading}
          >
            {loading ? "Yüklənir..." : "Yenilə"}
          </button>
        </div>
      </div>

      {err && (
        <div className="rounded-xl bg-red-50 text-red-700 px-3 py-2">{err}</div>
      )}

      <div className="bg-white border rounded-2xl shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b text-left">
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">Tarix</th>
              <th className="px-3 py-2">Reytinq</th>
              <th className="px-3 py-2">Ofisiant</th>
              <th className="px-3 py-2">Mesaj</th>
              <th className="px-3 py-2">Şəkillər</th>
              <th className="px-3 py-2 text-right">Əməliyyat</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td className="px-3 py-3" colSpan={7}>
                  Yüklənir...
                </td>
              </tr>
            )}

            {!loading && rows.length === 0 && (
              <tr>
                <td className="px-3 py-3" colSpan={7}>
                  Hələ rəy yoxdur.
                </td>
              </tr>
            )}

            {!loading &&
              rows.map((f, i) => {
                const id = getId(f);
                const images = (f.images || [])
                  .map(getImageUrl)
                  .filter(Boolean) as string[];
                const shortMsg =
                  (f.message || "").length > 60
                    ? (f.message || "").slice(0, 60) + "…"
                    : f.message || "";

                const date = f.createdAt
                  ? new Date(f.createdAt).toLocaleString()
                  : "-";

                return (
                  <tr key={id || i} className="border-b last:border-0">
                    <td className="px-3 py-2">
                      {(page - 1) * limit + (i + 1)}
                    </td>
                    <td className="px-3 py-2">{date}</td>
                    <td className="px-3 py-2">
                      <Stars value={Number(f.rating) || 0} />
                    </td>
                    <td className="px-3 py-2">{getWaiterName(f)}</td>
                    <td className="px-3 py-2">{shortMsg}</td>
                    <td className="px-3 py-2">
                      {images.length ? (
                        <div className="flex gap-2">
                          {images.slice(0, 3).map((src, idx) => (
                            <img
                              key={idx}
                              src={`${import.meta.env.VITE_API_URL}${src}`}
                              alt={`img-${idx}`}
                              className="h-10 w-10 object-cover rounded-md border"
                            />
                          ))}
                          {images.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{images.length - 3}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex justify-end">
                        <button
                          onClick={() => navigate(`/admin/feedback/${id}`)}
                          className="px-3 py-1.5 rounded-lg border hover:bg-gray-50"
                        >
                          Bax
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end gap-2">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="rounded-xl border px-3 py-1.5 hover:bg-gray-50 disabled:opacity-50"
        >
          ← Əvvəlki
        </button>
        <span className="text-sm">
          Səhifə {page} / {pages}
        </span>
        <button
          disabled={page >= pages}
          onClick={() => setPage((p) => Math.min(pages, p + 1))}
          className="rounded-xl border px-3 py-1.5 hover:bg-gray-50 disabled:opacity-50"
        >
          Növbəti →
        </button>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getFeedbackById } from "../service/feedbackService";

type FeedbackItem = {
  _id?: string;
  id?: string;
  rating: number;
  waiter?: { name?: string };
  waiterName?: string;
  message?: string;
  images?: (string | { url: string })[];
  createdAt?: string;
};

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

export default function FeedbackDetailPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState<FeedbackItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setErr(null);
      try {
        const data = await getFeedbackById(id);
        setItem(data as FeedbackItem);
      } catch (e: any) {
        setErr(e?.message || "Məlumat tapılmadı.");
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  if (loading) return <div className="p-6">Yüklənir...</div>;
  if (err) return <div className="p-6 text-red-600">{err}</div>;
  if (!item) return <div className="p-6">Tapılmadı.</div>;

  const images = (item.images || [])
    .map(getImageUrl)
    .filter(Boolean) as string[];

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Rəy detalları</h1>
        <button
          onClick={() => navigate(-1)}
          className="rounded-xl border px-4 py-2 hover:bg-gray-50"
        >
          Geri
        </button>
      </div>

      <div className="bg-white border rounded-2xl shadow-sm p-6 space-y-3">
        <div className="flex flex-wrap gap-6">
          <div>
            <div className="text-xs text-gray-500">Tarix</div>
            <div>
              {item.createdAt ? new Date(item.createdAt).toLocaleString() : "-"}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Reytinq</div>
            <div className="text-lg">
              <Stars value={Number(item.rating) || 0} />
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Ofisiant</div>
            <div>{item.waiter?.name || item.waiterName || "-"}</div>
          </div>
        </div>

        <div>
          <div className="text-xs text-gray-500 mb-1">Mesaj</div>
          <div className="whitespace-pre-wrap">{item.message || "-"}</div>
        </div>

        <div>
          <div className="text-xs text-gray-500 mb-2">Şəkillər</div>
          {images.length ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {images.map((src, i) => (
                <a
                  key={i}
                  href={src}
                  target="_blank"
                  rel="noreferrer"
                  className="block"
                >
                  <img
                    src={`${import.meta.env.VITE_API_URL}${src}`}
                    alt={`img-${i}`}
                    className="h-80 w-full object-contain rounded-xl border"
                  />
                </a>
              ))}
            </div>
          ) : (
            <span className="text-gray-400">—</span>
          )}
        </div>
      </div>
    </div>
  );
}

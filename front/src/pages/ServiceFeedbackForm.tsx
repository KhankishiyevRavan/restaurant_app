import React, { useEffect, useMemo, useRef, useState } from "react";
import { createFeedback } from "../service/feedbackService";
import { useTranslation } from "react-i18next";

// Types
export type Waiter = { id?: string; _id?: string; name: string };
export type ServiceFeedbackFormProps = {
  waiters: Waiter[]; // Ofisiant siyahısı (API-dən gəlir)
  maxImages?: number; // default 3
  minImages?: number; // default 1
  onSubmitted?: () => void; // uğurlu göndərişdən sonra callback
};

// ⭐️ Ulduz komponenti
function Stars({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const { t } = useTranslation("feedback");
  return (
    <div className="flex gap-1" role="radiogroup" aria-label={t("rating")}>
      {Array.from({ length: 5 }).map((_, i) => {
        const v = i + 1;
        const active = v <= value;
        return (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={`text-2xl transition-transform hover:scale-110 ${
              active ? "" : "opacity-40"
            }`}
            aria-checked={active}
            role="radio"
            aria-label={t("star_number", { count: v })}
            title={t("star_number", { count: v })}
          >
            {active ? "★" : "☆"}
          </button>
        );
      })}
    </div>
  );
}

// 📤 Şəkil inputu (1-3 arasında) + yoxlamalar
function ImagePicker({
  files,
  setFiles,
  maxImages,
  maxFileSizeMB = 5,
}: {
  files: File[];
  setFiles: (f: File[]) => void;
  maxImages: number;
  maxFileSizeMB?: number;
}) {
  const { t } = useTranslation("feedback");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const objectUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
      objectUrlsRef.current = [];
    };
  }, []);

  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;

    const allowed = selected.filter((f) => {
      const okType = /^image\/(jpe?g|png|webp|gif)$/i.test(f.type);
      const okSize = f.size <= maxFileSizeMB * 1024 * 1024;
      return okType && okSize;
    });

    // təkrarları at (ad+ölçü ilə kobud yoxlama)
    const dedup = allowed.filter(
      (nf) => !files.some((f) => f.name === nf.name && f.size === nf.size)
    );

    const merged = [...files, ...dedup].slice(0, maxImages);
    setFiles(merged);
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeAt = (idx: number) => {
    setFiles(files.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={onSelect}
          className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-yellow-500 file:text-white hover:file:bg-yellow-600 cursor-pointer"
          aria-label={t("images")}
        />
        <span className="text-sm text-gray-500">
          {t("images_hint", { max: maxImages, size: maxFileSizeMB })}
        </span>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {files.map((f, idx) => {
            const url = URL.createObjectURL(f);
            objectUrlsRef.current.push(url);
            return (
              <div
                key={idx}
                className="relative group rounded-xl overflow-hidden border"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={f.name}
                  className="h-28 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeAt(idx)}
                  className="absolute top-1 right-1 rounded-full bg-black/70 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100"
                  aria-label={t("remove_image")}
                  title={t("remove_image")}
                >
                  {t("remove")}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ServiceFeedbackForm({
  waiters,
  maxImages = 3,
  minImages = 1,
  onSubmitted,
}: ServiceFeedbackFormProps) {
  const { t } = useTranslation();

  const [rating, setRating] = useState(0); // 1-5
  const [waiterId, setWaiterId] = useState("");
  const [message, setMessage] = useState(""); // optional
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const waiterOptions = useMemo(
    () =>
      waiters.map((w) => ({
        value: w.id || w._id || "",
        label: w.name,
      })),
    [waiters]
  );

  const validate = () => {
    if (rating < 1 || rating > 5) return t("error.required_rating");
    if (!waiterId) return t("error.required_waiter");
    if (images.length < minImages)
      return t("error.min_images", { min: minImages });
    if (images.length > maxImages)
      return t("error.max_images", { max: maxImages });
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    try {
      setLoading(true);
      await createFeedback({
        rating,
        waiterId,
        message: message || undefined,
        images,
      });

      setSuccess(t("success"));
      setRating(0);
      setWaiterId("");
      setMessage("");
      setImages([]);
      onSubmitted?.();
    } catch (err: any) {
      setError(err?.message || t("error.unknown"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-6 rounded-2xl border shadow-sm bg-white space-y-6"
      aria-label={t("form_title")}
    >
      <h2 className="text-2xl font-semibold">{t("form_title")}</h2>

      {/* 1) Reytinq */}
      <div className="space-y-1">
        <label className="block text-sm font-medium">{t("rating")}</label>
        <Stars value={rating} onChange={setRating} />
        <p className="text-xs text-gray-500">{t("rating_hint")}</p>
      </div>

      {/* 2) Ofisiant seçimi */}
      <div className="space-y-1">
        <label className="block text-sm font-medium">{t("waiter")}</label>
        <select
          value={waiterId}
          onChange={(e) => setWaiterId(e.target.value)}
          className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          aria-label={t("waiter")}
        >
          <option value="">{t("select_placeholder")}</option>
          {waiterOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* 3) Mətn (optional) */}
      <div className="space-y-1">
        <label className="block text-sm font-medium">
          {t("message_label")}
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder={t("message_placeholder") as string}
          className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
      </div>

      {/* 4) Şəkil əlavə et (min 1, max 3) */}
      <div className="space-y-1">
        <label className="block text-sm font-medium">{t("images")}</label>
        <ImagePicker
          files={images}
          setFiles={setImages}
          maxImages={maxImages}
        />
      </div>

      {/* Alerts */}
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

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-yellow-500 text-white px-5 py-2.5 hover:bg-yellow-600 disabled:opacity-50"
        >
          {loading ? t("submitting") : t("submit")}
        </button>
        <span className="text-xs text-gray-500">
          {t("limits_hint", { min: minImages, max: maxImages })}
        </span>
      </div>
    </form>
  );
}

import { useEffect, useState } from "react";
import {
  deleteWaiter,
  getWaiters,
  updateWaiter,
} from "../service/waiterService";

type RowWaiter = {
  _id?: string;
  id?: string;
  name: string;
  isActive?: boolean;
  createdAt?: string;
};

const getId = (w: RowWaiter) => w._id || w.id || "";

const isObjectId = (v: string) => /^[0-9a-fA-F]{24}$/.test(v);

export default function WaitersTable() {
  const [rows, setRows] = useState<RowWaiter[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editActive, setEditActive] = useState<boolean>(true);

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const data = await getWaiters();
      setRows(data);
    } catch (e: any) {
      setErr(e?.message || "Siyahı yüklənmədi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const startEdit = (w: RowWaiter) => {
    const id = getId(w);
    setEditId(id);
    setEditName(w.name || "");
    setEditActive(!!w.isActive);
    setSuccess(null);
    setErr(null);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
    setEditActive(true);
  };

  const saveEdit = async () => {
    if (!editId) return;
    if (!editName.trim()) {
      setErr("Ad boş ola bilməz.");
      return;
    }
    try {
      setErr(null);
      await updateWaiter(editId, {
        name: editName.trim(),
        isActive: editActive,
      });
      setSuccess("Yeniləmə uğurludur ✅");
      // local state-i yenilə
      setRows((prev) =>
        prev.map((r) =>
          getId(r) === editId
            ? { ...r, name: editName.trim(), isActive: editActive }
            : r
        )
      );
      cancelEdit();
    } catch (e: any) {
      setErr("Yeniləmə mümkün olmadı.");
    }
  };

  const removeRow = async (w: RowWaiter) => {
    const id = getId(w);
    if (!id) return;
    const confirmDelete = window.confirm(`"${w.name}" silinsin?`);
    if (!confirmDelete) return;

    try {
      setErr(null);
      await deleteWaiter(id);
      setRows((prev) => prev.filter((r) => getId(r) !== id));
      setSuccess("Silindi ✅");
    } catch (e: any) {
      setErr(e?.message || "Silinə bilmədi.");
    }
  };

  const hasData = rows.length > 0;

  return (
    <div className="p-6 bg-white rounded-2xl border shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Ofisiantlar</h2>
        <button
          onClick={load}
          className="px-4 py-2 rounded-xl border hover:bg-gray-50"
          disabled={loading}
        >
          {loading ? "Yüklənir..." : "Yenilə"}
        </button>
      </div>

      {err && (
        <div className="mb-3 rounded-xl bg-red-50 text-red-700 px-3 py-2">
          {err}
        </div>
      )}
      {success && (
        <div className="mb-3 rounded-xl bg-green-50 text-green-700 px-3 py-2">
          {success}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b bg-gray-50">
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">Ad</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2 text-right">Əməliyyatlar</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td className="px-3 py-3" colSpan={5}>
                  Yüklənir...
                </td>
              </tr>
            )}

            {!loading && !hasData && (
              <tr>
                <td className="px-3 py-3" colSpan={5}>
                  Hələ ofisiant yoxdur.
                </td>
              </tr>
            )}

            {!loading &&
              rows.map((w, idx) => {
                const rowId = getId(w);
                const editing = editId === rowId;

                return (
                  <tr key={rowId || idx} className="border-b last:border-0">
                    <td className="px-3 py-2">{idx + 1}</td>

                    {/* NAME */}
                    <td className="px-3 py-2">
                      {editing ? (
                        <input
                          className="w-full rounded-lg border px-2 py-1"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                        />
                      ) : (
                        <span>{w.name}</span>
                      )}
                    </td>

                    {/* ACTIVE */}
                    <td className="px-3 py-2">
                      {editing ? (
                        <label className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={editActive}
                            onChange={(e) => setEditActive(e.target.checked)}
                          />
                          <span>{editActive ? "Aktiv" : "Deaktiv"}</span>
                        </label>
                      ) : (
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            w.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {w.isActive ? "Aktiv" : "Deaktiv"}
                        </span>
                      )}
                    </td>

                    {/* ID */}
                    <td className="px-3 py-2">
                      <code className="text-xs">
                        {rowId}
                        {!rowId ? "" : isObjectId(rowId) ? "" : " (custom)"}
                      </code>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2 justify-end">
                        {editing ? (
                          <>
                            <button
                              onClick={saveEdit}
                              className="px-3 py-1.5 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600"
                            >
                              Yadda saxla
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="px-3 py-1.5 rounded-lg border hover:bg-gray-50"
                            >
                              İmtina
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(w)}
                              className="px-3 py-1.5 rounded-lg border hover:bg-gray-50"
                            >
                              Düzəliş
                            </button>
                            <button
                              onClick={() => removeRow(w)}
                              className="px-3 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600"
                            >
                              Sil
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

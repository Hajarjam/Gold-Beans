// src/pages/admin/products/Coffees.jsx
import { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URLL;

function StockBadge({ stock }) {
  return stock > 0 ? (
    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
      In Stock ({stock})
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-800">
      Out of Stock
    </span>
  );
}

export default function Coffees() {
  const [coffees, setCoffees] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("nameAsc");
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // ✅ Delete Modal states
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(null); // coffee object
  const [deletingLoading, setDeletingLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    origin: "",
    roastLevel: "Medium",
    tasteProfile: "",
    intensity: 3,
    imageFile: null,
  });

  const tasteLabel = (arr) =>
    Array.isArray(arr) && arr.length ? arr.join(", ") : "-";


  async function load() {
    setLoading(true);
    try {
      const r = await fetch(
        `${API_URL}/api/coffees?search=${encodeURIComponent(search)}&sort=${sort}`
      );
      const data = await r.json().catch(() => []);
      const list = Array.isArray(data) ? data : data.coffees || [];
      setCoffees(list);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  function openCreate() {
    setEditing(null);
    setForm({
      name: "",
      description: "",
      price: "",
      stock: "",
      origin: "",
      roastLevel: "Medium",
      tasteProfile: "",
      intensity: 3,
      imageFile: null,
    });
    setOpen(true);
  }

  function openEdit(c) {
    setEditing(c);
    setForm({
      name: c.name || "",
      description: c.description || "",
      price: String(c.price ?? ""),
      stock: String(c.stock ?? ""),
      origin: c.origin || "",
      roastLevel: c.roastLevel || "Medium",
      tasteProfile: Array.isArray(c.tasteProfile) ? c.tasteProfile.join(", ") : "",
      intensity: Number(c.intensity ?? 3),
      imageFile: null,
    });
    setOpen(true);
  }

  async function save(e) {
    e.preventDefault();

    const fd = new FormData();
    fd.append("name", form.name.trim());
    fd.append("description", form.description.trim());
    fd.append("price", String(Number(form.price)));
    fd.append("stock", String(Number(form.stock)));
    fd.append("origin", form.origin.trim());
    fd.append("roastLevel", form.roastLevel);
    fd.append("intensity", String(Number(form.intensity)));

    fd.append("tasteProfile", form.tasteProfile.trim());

    if (form.imageFile) fd.append("image", form.imageFile);

    const url = editing
      ? `${API_URL}/api/coffees/${editing._id}`
      : `${API_URL}/api/coffees`;

    const method = editing ? "PUT" : "POST";

    const r = await fetch(url, {
      method,
      body: fd, 
    });

    const data = await r.json().catch(() => ({}));
    if (!r.ok) return alert(data.message || data.error || "Error");

    setOpen(false);
    await load();
  }


  // ✅ Open styled delete modal
  function askDelete(coffee) {
    setDeleting(coffee);
    setConfirmOpen(true);
  }

  // ✅ Confirm delete
  async function confirmDelete() {
    if (!deleting?._id) return;
    setDeletingLoading(true);
    try {
      const r = await fetch(`${API_URL}/api/coffees/${deleting._id}`, {
        method: "DELETE",
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) return window.alert(data.message || data.error || "Delete failed");

      setConfirmOpen(false);
      setDeleting(null);
      await load();
    } finally {
      setDeletingLoading(false);
    }
  }

  return (
    <>
      <div className="flex px-9 flex-wrap items-end justify-between gap-2 py-3">
        <h1 className="text-2xl font-bold">Coffees</h1>

        <div className="flex flex-wrap items-center gap-7">
          <div className="relative w-full max-w-[200px]">
            <svg
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#3B170D]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>

            <input
              className="w-full rounded-full border border-[#E6D8CF] bg-white pl-11 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#3B170D]/20"
              placeholder="Search coffee..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-[#3B170D]">Sort by</span>
            <select
              className="rounded-xl border border-[#E6D8CF] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#3B170D]/20"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="nameAsc">Name (A-Z)</option>
              <option value="nameDesc">Name (Z-A)</option>
              <option value="priceAsc">Price (Low)</option>
              <option value="priceDesc">Price (High)</option>
              <option value="stockAsc">Stock (Low)</option>
              <option value="stockDesc">Stock (High)</option>
            </select>
          </div>

          <button
            onClick={openCreate}
            className="rounded-xl bg-[#3B170D] px-4 py-2 text-sm font-bold text-white hover:opacity-90"
            type="button"
          >
            Add New Coffee +
          </button>
        </div>
      </div>

      {/* Table */}
      {/* ===== Mobile: Cards ===== */}
      <div className="px-4 sm:hidden">
        {loading ? (
          <div className="text-sm text-[#3B170D]/60">Loading...</div>
        ) : coffees.length === 0 ? (
          <div className="text-sm text-[#3B170D]/60">No coffees</div>
        ) : (
          <div className="grid gap-3">
            {coffees.map((c) => (
              <div
                key={c._id}
                className="rounded-2xl border border-[#EADFD7] bg-white p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 overflow-hidden rounded-xl border border-[#EADFD7] bg-[#F2E6DE] grid place-items-center shrink-0">
                    {c.images?.[0] ? (
                      <img
                        src={c.images[0]}
                        alt={c.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span>☕</span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-extrabold truncate">{c.name}</div>
                      <span className="text-xs text-[#3B170D]/60">
                        #{String(c._id).slice(-6)}
                      </span>
                    </div>

                    <div className="mt-1 text-xs text-[#3B170D]/55 line-clamp-2">
                      {c.description || "-"}
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full border border-[#EADFD7] px-2 py-1">
                        Origin: {c.origin || "-"}
                      </span>

                      <span className="rounded-full border border-[#EADFD7] px-2 py-1">
                        Roast: {c.roastLevel || "-"}
                      </span>

                      <span className="rounded-full border border-[#EADFD7] px-2 py-1">
                        Taste: {tasteLabel(c.tasteProfile)}
                      </span>

                      {c.intensity ? (
                        <span className="rounded-full border border-[#EADFD7] px-2 py-1">
                          Intensity: {c.intensity}/5
                        </span>
                      ) : null}

                      <span className="rounded-full border border-[#EADFD7] px-2 py-1 font-bold text-green-800">
                        {c.price} dhs/kg
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <StockBadge stock={c.stock} />

                      <div className="flex items-center gap-2">
                        <button
                          className="rounded-lg px-2 py-2 hover:bg-[#3B170D]/10"
                          onClick={() => openEdit(c)}
                          title="Edit"
                          type="button"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-[#3B170D]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.8}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.862 3.487a2.1 2.1 0 0 1 2.97 2.97L7.125 19.164a4.2 4.2 0 0 1-1.77 1.033l-3.355 1.12 1.12-3.355a4.2 4.2 0 0 1 1.033-1.77L16.862 3.487z"
                            />
                          </svg>
                        </button>

                        <button
                          className="rounded-lg p-2 text-red-600 hover:bg-red-100 transition"
                          onClick={() => askDelete(c)}
                          title="Delete"
                          type="button"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.8}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 3h6m-7 4h8m-1 0v11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V7m3 4v6m4-6v6M5 7h14"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== Desktop/Table ===== */}
      <div className="hidden sm:block mx-4 sm:mx-8 mt-4 overflow-hidden rounded-2xl border border-[#EADFD7] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full text-left">
            <thead className="bg-[#3B170D] text-white">
              <tr className="text-xs font-extrabold">
                <th className="px-4 py-3"># ID</th>
                <th className="px-4 py-3">Coffee</th>
                <th className="px-4 py-3">Origin</th>
                <th className="px-4 py-3">Roast</th>
                <th className="px-4 py-3">Price (dhs/kg)</th>
                <th className="px-4 py-3">Stock (Kg)</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-4 text-sm text-[#3B170D]/60" colSpan={7}>
                    Loading...
                  </td>
                </tr>
              ) : coffees.length === 0 ? (
                <tr>
                  <td className="px-4 py-4 text-sm text-[#3B170D]/60" colSpan={7}>
                    No coffees
                  </td>
                </tr>
              ) : (
                coffees.map((c) => (
                  <tr key={c._id} className="border-t border-[#F0E6DF]">
                    <td className="px-4 py-4 text-sm text-[#3B170D]/60">
                      #{String(c._id).slice(-6)}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 overflow-hidden rounded-xl border border-[#EADFD7] bg-[#F2E6DE] grid place-items-center">
                          {c.images?.[0] ? (
                            <img
                              src={c.images[0]}
                              alt={c.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span>☕</span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="font-extrabold">{c.name}</div>
                          <div className="text-xs text-[#3B170D]/55 truncate max-w-[420px]">
                            {c.description}
                          </div>
                          <div className="mt-1 text-[11px] text-[#3B170D]/60">
                            Taste: {tasteLabel(c.tasteProfile)}
                            {c.intensity ? ` • Intensity: ${c.intensity}/5` : ""}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-sm">{c.origin || "-"}</td>
                    <td className="px-4 py-4 text-sm">{c.roastLevel || "-"}</td>

                    <td className="px-4 py-4 text-sm font-extrabold text-green-800">
                      {c.price}
                    </td>

                    <td className="px-4 py-4">
                      <StockBadge stock={c.stock} />
                    </td>

                    <td className="px-4 py-4 text-right">
                      <button
                        className="mr-2 rounded-lg px-2 py-1 hover:bg-[#3B170D]/10"
                        onClick={() => openEdit(c)}
                        title="Edit"
                        type="button"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-[#3B170D]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.8}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.862 3.487a2.1 2.1 0 0 1 2.97 2.97L7.125 19.164a4.2 4.2 0 0 1-1.77 1.033l-3.355 1.12 1.12-3.355a4.2 4.2 0 0 1 1.033-1.77L16.862 3.487z"
                          />
                        </svg>
                      </button>

                      <button
                        className="rounded-lg p-2 text-red-600 hover:bg-red-100 transition"
                        onClick={() => askDelete(c)}
                        title="Delete"
                        type="button"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.8}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 3h6m-7 4h8m-1 0v11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V7m3 4v6m4-6v6M5 7h14"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>


      {/* Modal Add/Edit */}
      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/35 p-4"
          onMouseDown={() => setOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-[#EADFD7] bg-white p-5 shadow-xl"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-extrabold">
              {editing ? "Edit coffee" : "Add coffee"}
            </h2>

            <form onSubmit={save} className="mt-4 grid gap-3">
              <input
                className="rounded-xl border border-[#E6D8CF] px-3 py-2 outline-none focus:ring-2 focus:ring-[#3B170D]/20"
                placeholder="Coffee name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />

              <input
                className="rounded-xl border border-[#E6D8CF] px-3 py-2 outline-none focus:ring-2 focus:ring-[#3B170D]/20"
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  className="rounded-xl border border-[#E6D8CF] px-3 py-2 outline-none focus:ring-2 focus:ring-[#3B170D]/20"
                  placeholder="Price (dhs)"
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  required
                />
                <input
                  className="rounded-xl border border-[#E6D8CF] px-3 py-2 outline-none focus:ring-2 focus:ring-[#3B170D]/20"
                  placeholder="Stock (Kg)"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                  required
                />
              </div>

              <input
                className="rounded-xl border border-[#E6D8CF] px-3 py-2 outline-none focus:ring-2 focus:ring-[#3B170D]/20"
                placeholder="Origin (e.g. Ethiopia)"
                value={form.origin}
                onChange={(e) => setForm((f) => ({ ...f, origin: e.target.value }))}
                required
              />

              <select
                className="rounded-xl border border-[#E6D8CF] px-3 py-2 outline-none focus:ring-2 focus:ring-[#3B170D]/20"
                value={form.roastLevel}
                onChange={(e) => setForm((f) => ({ ...f, roastLevel: e.target.value }))}
                required
              >
                <option value="Light">Light</option>
                <option value="Medium">Medium</option>
                <option value="Dark">Dark</option>
              </select>

              <input
                className="rounded-xl border border-[#E6D8CF] px-3 py-2 outline-none focus:ring-2 focus:ring-[#3B170D]/20"
                placeholder='Taste profile (comma) e.g. "chocolate, nutty"'
                value={form.tasteProfile}
                onChange={(e) => setForm((f) => ({ ...f, tasteProfile: e.target.value }))}
                required
              />

              <input
                className="rounded-xl border border-[#E6D8CF] px-3 py-2 outline-none focus:ring-2 focus:ring-[#3B170D]/20"
                placeholder="Intensity (1-5)"
                type="number"
                min="1"
                max="5"
                value={form.intensity}
                onChange={(e) => setForm((f) => ({ ...f, intensity: e.target.value }))}
                required
              />

              <input
                className="rounded-xl border border-[#E6D8CF] px-3 py-2 outline-none focus:ring-2 focus:ring-[#3B170D]/20"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setForm((f) => ({ ...f, imageFile: e.target.files?.[0] || null }))
                }
              />


              <div className="mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  className="rounded-xl border border-[#EADFD7] bg-white px-4 py-2 text-sm font-bold hover:bg-[#3B170D]/5"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="rounded-xl bg-[#3B170D] px-4 py-2 text-sm font-bold text-white hover:opacity-90"
                  type="submit"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}



      {/* ✅ Delete Confirmation Modal (Styled) */}
      {confirmOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
          onMouseDown={() => !deletingLoading && setConfirmOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-[#EADFD7] bg-white p-5 shadow-xl"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-red-50 grid place-items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v4m0 4h.01M10.29 3.86l-7.1 12.3A2 2 0 0 0 4.93 19h14.14a2 2 0 0 0 1.74-2.84l-7.1-12.3a2 2 0 0 0-3.42 0z"
                  />
                </svg>
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-extrabold text-[#3B170D]">
                  Delete coffee?
                </h3>
                <p className="mt-1 text-sm text-[#3B170D]/70">
                  You are about to delete{" "}
                  <span className="font-bold text-[#3B170D]">
                    {deleting?.name}
                  </span>
                  . This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                disabled={deletingLoading}
                className="rounded-xl border border-[#EADFD7] bg-white px-4 py-2 text-sm font-bold hover:bg-[#3B170D]/5 disabled:opacity-50"
                onClick={() => setConfirmOpen(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deletingLoading}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-50"
                onClick={confirmDelete}
              >
                {deletingLoading ? "Deleting..." : "Yes, delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

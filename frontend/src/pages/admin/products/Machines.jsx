// src/pages/admin/products/Machines.jsx
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

export default function Machines() {
  const [machines, setMachines] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("nameAsc");
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // ✅ Delete Modal states
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(null); // machine object
  const [deletingLoading, setDeletingLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    type: "espresso",
    description: "",
    coffeeTypeSupported: ["beans"], // schema: [String]
    price: "",
    stock: "",
    imageFile: null,
  });

  async function load() {
    setLoading(true);
    try {
      const r = await fetch(
        `${API_URL}/api/machines?search=${encodeURIComponent(search)}&sort=${sort}`
      );
      const data = await r.json().catch(() => []);
      const list = Array.isArray(data) ? data : data.machines || [];
      setMachines(list);
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
      type: "espresso",
      description: "",
      coffeeTypeSupported: ["beans"],
      price: "",
      stock: "",
      imageFile: null,
    });
    setOpen(true);
  }

  function openEdit(m) {
    setEditing(m);
    setForm({
      name: m.name || "",
      type: m.type || "espresso",
      description: m.description || "",
      coffeeTypeSupported: Array.isArray(m.coffeeTypeSupported)
        ? m.coffeeTypeSupported
        : ["beans"],
      price: String(m.price ?? ""),
      stock: String(m.stock ?? ""),
      imageFile: null,
    });
    setOpen(true);
  }


  async function save(e) {
    e.preventDefault();

    const fd = new FormData();
    fd.append("name", form.name.trim());
    fd.append("type", form.type.trim());
    fd.append("description", form.description.trim());
    fd.append("coffeeTypeSupported", form.coffeeTypeSupported.join(","));
    fd.append("price", String(Number(form.price)));
    fd.append("stock", String(Number(form.stock)));

    if (form.imageFile) fd.append("image", form.imageFile);

    const url = editing
      ? `${API_URL}/api/machines/${editing._id}`
      : `${API_URL}/api/machines`;

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

  // ✅ Styled delete workflow
  function askDelete(machine) {
    setDeleting(machine);
    setConfirmOpen(true);
  }

  async function confirmDelete() {
    if (!deleting?._id) return;
    setDeletingLoading(true);

    try {
      const r = await fetch(`${API_URL}/api/machines/${deleting._id}`, {
        method: "DELETE",
      });

      const data = await r.json().catch(() => ({}));
      if (!r.ok)
        return window.alert(data.message || data.error || "Delete failed");

      setConfirmOpen(false);
      setDeleting(null);
      await load();
    } finally {
      setDeletingLoading(false);
    }
  }

  const coffeeTypeLabel = (arr) =>
    Array.isArray(arr) && arr.length ? arr.join(", ") : "-";

  return (
    <>
      {/* Header responsive */}
      <div className="px-4 sm:px-9 py-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="text-2xl font-bold">Machines</h1>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5 w-full sm:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-[220px]">
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
                placeholder="Search machines..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-sm text-[#3B170D] whitespace-nowrap">
                Sort by
              </span>
              <select
                className="w-full sm:w-auto rounded-xl border border-[#E6D8CF] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#3B170D]/20"
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

            {/* Button */}
            <button
              onClick={openCreate}
              className="w-full sm:w-auto rounded-xl bg-[#3B170D] px-4 py-2 text-sm font-bold text-white hover:opacity-90"
              type="button"
            >
              Add New Machine +
            </button>
          </div>
        </div>
      </div>

      {/* ===== Mobile: Cards ===== */}
      <div className="px-4 sm:hidden">
        {loading ? (
          <div className="text-sm text-[#3B170D]/60">Loading...</div>
        ) : machines.length === 0 ? (
          <div className="text-sm text-[#3B170D]/60">No machines</div>
        ) : (
          <div className="grid gap-3">
            {machines.map((m) => (
              <div
                key={m._id}
                className="rounded-2xl border border-[#EADFD7] bg-white p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 overflow-hidden rounded-xl border border-[#EADFD7] bg-[#F2E6DE] grid place-items-center shrink-0">
                    {m.images?.[0] ? (
                      <img
                        src={m.images[0]}
                        alt={m.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <span>⚙️</span>
                    )}

                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-extrabold truncate">{m.name}</div>
                      <span className="text-xs text-[#3B170D]/60">
                        #{String(m._id).slice(-6)}
                      </span>
                    </div>

                    <div className="mt-1 text-xs text-[#3B170D]/55 line-clamp-2">
                      {m.description || "-"}
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full border border-[#EADFD7] px-2 py-1">
                        Type: {m.type || "-"}
                      </span>
                      <span className="rounded-full border border-[#EADFD7] px-2 py-1">
                        Supports: {coffeeTypeLabel(m.coffeeTypeSupported)}
                      </span>
                      <span className="rounded-full border border-[#EADFD7] px-2 py-1 font-bold text-green-800">
                        {m.price} dhs
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <StockBadge stock={m.stock} />

                      <div className="flex items-center gap-2">
                        <button
                          className="rounded-lg px-2 py-2 hover:bg-[#3B170D]/10"
                          onClick={() => openEdit(m)}
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
                          onClick={() => askDelete(m)}
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
      <div className="hidden sm:block mx-8 mt-4 overflow-hidden rounded-2xl border border-[#EADFD7] bg-white shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-[#3B170D] text-white">
            <tr className="text-xs font-extrabold">
              <th className="px-4 py-3"># ID</th>
              <th className="px-4 py-3">Machine</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Coffee Type Supported</th>
              <th className="px-4 py-3">Price (dhs)</th>
              <th className="px-4 py-3">Stock</th>
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
            ) : machines.length === 0 ? (
              <tr>
                <td className="px-4 py-4 text-sm text-[#3B170D]/60" colSpan={7}>
                  No machines
                </td>
              </tr>
            ) : (
              machines.map((m) => (
                <tr key={m._id} className="border-t border-[#F0E6DF]">
                  <td className="px-4 py-4 text-sm text-[#3B170D]/60">
                    #{String(m._id).slice(-6)}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 overflow-hidden rounded-xl border border-[#EADFD7] bg-[#F2E6DE] grid place-items-center">
                        {m.images?.[0] ? (
                          <img
                            src={m.images[0]}
                            alt={m.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <span>⚙️</span>
                        )}

                      </div>

                      <div>
                        <div className="font-extrabold">{m.name}</div>
                        <div className="text-xs text-[#3B170D]/55">
                          {m.description}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-sm">{m.type || "-"}</td>

                  <td className="px-4 py-4 text-sm">
                    {coffeeTypeLabel(m.coffeeTypeSupported)}
                  </td>

                  <td className="px-4 py-4 text-sm font-extrabold text-green-800">
                    {m.price}
                  </td>

                  <td className="px-4 py-4">
                    <StockBadge stock={m.stock} />
                  </td>

                  <td className="px-4 py-4 text-right">
                    <button
                      className="mr-2 rounded-lg px-2 py-1 hover:bg-[#3B170D]/10"
                      onClick={() => openEdit(m)}
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
                      onClick={() => askDelete(m)}
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

      {/* Modal responsive (Add/Edit) */}
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
              {editing ? "Edit machine" : "Add machine"}
            </h2>

            <form onSubmit={save} className="mt-4 grid gap-3">
              <input
                className="rounded-xl border border-[#E6D8CF] px-3 py-2 outline-none focus:ring-2 focus:ring-[#3B170D]/20"
                placeholder="Machine name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />

              <select
                className="rounded-xl border border-[#E6D8CF] px-3 py-2 outline-none focus:ring-2 focus:ring-[#3B170D]/20"
                value={form.type}
                onChange={(e) =>
                  setForm((f) => ({ ...f, type: e.target.value }))
                }
                required
              >
                <option value="espresso">espresso</option>
                <option value="filter">filter</option>
                <option value="bean-to-cup">bean-to-cup</option>
                <option value="manual">manual</option>
              </select>

              <input
                className="rounded-xl border border-[#E6D8CF] px-3 py-2 outline-none focus:ring-2 focus:ring-[#3B170D]/20"
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                required
              />

              {/* Multi-select for coffeeTypeSupported */}
              <div className="rounded-xl border border-[#E6D8CF] px-3 py-2">
                <div className="text-xs font-bold text-[#3B170D]/70 mb-2">
                  Coffee type supported
                </div>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.coffeeTypeSupported.includes("beans")}
                    onChange={(e) => {
                      setForm((f) => {
                        const set = new Set(f.coffeeTypeSupported);
                        e.target.checked ? set.add("beans") : set.delete("beans");
                        return { ...f, coffeeTypeSupported: Array.from(set) };
                      });
                    }}
                  />
                  beans
                </label>

                <label className="mt-2 flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.coffeeTypeSupported.includes("ground")}
                    onChange={(e) => {
                      setForm((f) => {
                        const set = new Set(f.coffeeTypeSupported);
                        e.target.checked ? set.add("ground") : set.delete("ground");
                        return { ...f, coffeeTypeSupported: Array.from(set) };
                      });
                    }}
                  />
                  ground
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  className="rounded-xl border border-[#E6D8CF] px-3 py-2 outline-none focus:ring-2 focus:ring-[#3B170D]/20"
                  placeholder="Price (dhs)"
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, price: e.target.value }))
                  }
                  required
                />
                <input
                  className="rounded-xl border border-[#E6D8CF] px-3 py-2 outline-none focus:ring-2 focus:ring-[#3B170D]/20"
                  placeholder="Stock"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, stock: e.target.value }))
                  }
                  required
                />
              </div>

              <input
                className="rounded-xl border border-[#E6D8CF] px-3 py-2 outline-none focus:ring-2 focus:ring-[#3B170D]/20"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setForm((f) => ({ ...f, imageFile: e.target.files?.[0] || null }))
                }
              />

              <div className="mt-2 flex flex-col sm:flex-row justify-end gap-2">
                <button
                  type="button"
                  className="w-full sm:w-auto rounded-xl border border-[#EADFD7] bg-white px-4 py-2 text-sm font-bold hover:bg-[#3B170D]/5"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="w-full sm:w-auto rounded-xl bg-[#3B170D] px-4 py-2 text-sm font-bold text-white hover:opacity-90"
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
                  Delete machine?
                </h3>
                <p className="mt-1 text-sm text-[#3B170D]/70">
                  You are about to delete{" "}
                  <span className="font-bold text-[#3B170D]">
                    {deleting?.name}
                  </span>
                  . This action can’t be undone.
                </p>

                <div className="mt-4 flex flex-col sm:flex-row justify-end gap-2">
                  <button
                    type="button"
                    disabled={deletingLoading}
                    className="w-full sm:w-auto rounded-xl border border-[#EADFD7] bg-white px-4 py-2 text-sm font-bold hover:bg-[#3B170D]/5 disabled:opacity-60"
                    onClick={() => setConfirmOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={deletingLoading}
                    className="w-full sm:w-auto rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:opacity-90 disabled:opacity-60"
                    onClick={confirmDelete}
                  >
                    {deletingLoading ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

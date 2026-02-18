import { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URLL;

export default function Users() {
  const [clients, setclients] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("firstNameAsc");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [deletingLoading, setDeletingLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    adresse: "",
    role: "client",
    isActive: true,
    password: "",
  });

  async function load() {
    setLoading(true);
    try {
      const r = await fetch(
        `${API_URL}/api/users?search=${encodeURIComponent(search)}&sort=${sort}`
      );
      const data = await r.json().catch(() => []);
      const list = Array.isArray(data) ? data : data.clients || [];
      setclients(list);
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
      firstName: "",
      lastName: "",
      email: "",
      adresse: "",
      role: "client",
      isActive: true,
      password: "",
    });
    setOpen(true);
  }

  function openEdit(m) {
    setEditing(m);
    setForm({
      firstName: m.firstName || "",
      lastName: m.lastName || "",
      email: m.email || "",
      adresse: m.addresses?.length ? m.addresses[0].street || "" : "", // ✅
      role: m.role || "client",
      isActive: Boolean(m.isActive),
      password: "", // inutile en edit
    });
    setOpen(true);
  }

  async function save(e) {
    e.preventDefault();

    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      adresse: form.adresse.trim(),
      role: form.role,
      isActive: Boolean(form.isActive),
      ...(editing ? {} : { password: form.password }), // ✅ password seulement en POST
    };

    const url = editing
      ? `${API_URL}/api/users/${editing._id}`
      : `${API_URL}/api/users`;

    const method = editing ? "PUT" : "POST";


    const r = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await r.json().catch(() => ({}));
    if (!r.ok) return alert(data.message || data.error || "Error");

    setOpen(false);
    await load();
  }

  function askDelete(client) {
    setDeleting(client);
    setConfirmOpen(true);
  }

  async function confirmDelete() {
    if (!deleting?._id) return;
    setDeletingLoading(true);

    try {
      const r = await fetch(`${API_URL}/api/users/${deleting._id}`, { method: "DELETE" });

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
      <div className="px-4 sm:px-9 py-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="text-2xl font-bold">Users (Admin + Client)</h1>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5 w-full sm:w-auto">
            <div className="relative w-full sm:w-[220px]">
              <input
                className="w-full rounded-full border border-[#E6D8CF] bg-white pl-4 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#3B170D]/20"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-sm text-[#3B170D] whitespace-nowrap">Sort by</span>
              <select
                className="w-full sm:w-auto rounded-xl border border-[#E6D8CF] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#3B170D]/20"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="firstNameAsc">first Name (A-Z)</option>
                <option value="firstNameDesc">first Name (Z-A)</option>
                <option value="lastNameAsc">last Name (A-Z)</option>
                <option value="lastNameDesc">last Name (Z-A)</option>
              </select>
            </div>

            <button
              onClick={openCreate}
              className="w-full sm:w-auto rounded-xl bg-[#3B170D] px-4 py-2 text-sm font-bold text-white hover:opacity-90"
              type="button"
            >
              Add New user +
            </button>
          </div>
        </div>
      </div>

      {/* ===== Mobile: Cards ===== */}
      <div className="px-4 sm:hidden">
        {loading ? (
          <div className="text-sm text-[#3B170D]/60">Loading...</div>
        ) : clients.length === 0 ? (
          <div className="text-sm text-[#3B170D]/60">No user</div>
        ) : (
          <div className="grid gap-3">
            {clients.map((u) => (
              <div
                key={u._id}
                className="rounded-2xl border border-[#EADFD7] bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="font-extrabold truncate">
                        {u.firstName} {u.lastName}
                      </div>
                      <span className="text-xs text-[#3B170D]/60 shrink-0">
                        #{String(u._id).slice(-6)}
                      </span>
                    </div>

                    <div className="mt-1 text-xs text-[#3B170D]/60 truncate">
                      {u.email || "-"}
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full border border-[#EADFD7] px-2 py-1">
                        Adresse: {u.addresses?.length ? u.addresses[0].street : "-"}
                      </span>

                      <span
                        className={[
                          "px-3 py-1 rounded-full text-xs font-bold",
                          u.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800",
                        ].join(" ")}
                      >
                        {u.role}
                      </span>

                      {u.isActive ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-800">
                          Disabled
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      className="rounded-lg px-2 py-2 hover:bg-[#3B170D]/10"
                      onClick={() => openEdit(u)}
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
                      onClick={() => askDelete(u)}
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
            ))}
          </div>
        )}
      </div>


      <div className="hidden sm:block mx-8 mt-4 overflow-hidden rounded-2xl border border-[#EADFD7] bg-white shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-[#3B170D] text-white">
            <tr className="text-xs font-extrabold">
              <th className="px-4 py-3"># ID</th>
              <th className="px-4 py-3">First Name</th>
              <th className="px-4 py-3">Last Name</th>
              <th className="px-4 py-3">E-mail</th>
              <th className="px-4 py-3">Adresse</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td className="px-4 py-4 text-sm text-[#3B170D]/60" colSpan={8}>Loading...</td></tr>
            ) : clients.length === 0 ? (
              <tr><td className="px-4 py-4 text-sm text-[#3B170D]/60" colSpan={8}>No user</td></tr>
            ) : (
              clients.map((m) => (
                <tr key={m._id} className="border-t border-[#F0E6DF]">
                  <td className="px-4 py-4 text-sm text-[#3B170D]/60">#{String(m._id).slice(-6)}</td>
                  <td className="px-4 py-4 text-sm font-bold">{m.firstName}</td>
                  <td className="px-4 py-4 text-sm font-bold">{m.lastName}</td>
                  <td className="px-4 py-4 text-sm font-bold">{m.email}</td>
                  <td className="px-4 py-4 text-sm font-bold">
                    {m.addresses?.length ? `${m.addresses[0].street}` : "-"}
                  </td>

                  <td className="px-4 py-4 text-sm font-bold">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${m.userId?.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                      }`}>
                      {m.role}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-sm font-bold">
                    {m.isActive ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">Yes</span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-800">No</span>
                    )}
                  </td>

                  <td className="px-4 py-4 text-right">
                    <button
                      className="mr-2 rounded-lg px-2 py-1 hover:bg-[#3B170D]/10"
                      onClick={() => openEdit(m)}
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
                      className="rounded-lg px-2 py-1 text-red-600 hover:bg-red-100"
                      onClick={() => askDelete(m)}
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

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/35 p-4" onMouseDown={() => setOpen(false)}>
          <div className="w-full max-w-lg rounded-2xl border border-[#EADFD7] bg-white p-5 shadow-xl" onMouseDown={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-extrabold">{editing ? "Edit user" : "Add user"}</h2>

            <form onSubmit={save} className="mt-4 grid gap-3">
              <input className="rounded-xl border border-[#E6D8CF] px-3 py-2" placeholder="First Name" value={form.firstName}
                onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))} required />

              <input className="rounded-xl border border-[#E6D8CF] px-3 py-2" placeholder="Last Name" value={form.lastName}
                onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))} required />

              <input className="rounded-xl border border-[#E6D8CF] px-3 py-2" placeholder="Email" value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />

              <input className="rounded-xl border border-[#E6D8CF] px-3 py-2" placeholder="Adresse" value={form.adresse}
                onChange={(e) => setForm((f) => ({ ...f, adresse: e.target.value }))} />

              <select className="rounded-xl border border-[#E6D8CF] px-3 py-2"
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                required
              >
                <option value="client">client</option>
                <option value="admin">admin</option>
              </select>

              {!editing && (
                <input
                  className="rounded-xl border border-[#E6D8CF] px-3 py-2"
                  placeholder="Mot de passe"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  required
                />
              )}

              <label className="flex items-center gap-2 text-sm text-[#3B170D]">
                <input
                  type="checkbox"
                  checked={Boolean(form.isActive)}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                />
                Active
              </label>

              <div className="mt-2 flex justify-end gap-2">
                <button type="button" className="rounded-xl border px-4 py-2" onClick={() => setOpen(false)}>Cancel</button>
                <button className="rounded-xl bg-[#3B170D] px-4 py-2 text-white font-bold" type="submit">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onMouseDown={() => !deletingLoading && setConfirmOpen(false)}>
          <div className="w-full max-w-md rounded-2xl border border-[#EADFD7] bg-white p-5 shadow-xl" onMouseDown={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-extrabold text-[#3B170D]">Delete user?</h3>
            <p className="mt-2 text-sm text-[#3B170D]/70">
              Delete <span className="font-bold">{deleting?.userId?.firstName} {deleting?.userId?.lastName}</span> ?
            </p>

            <div className="mt-4 flex justify-end gap-2">
              <button type="button" disabled={deletingLoading} className="rounded-xl border px-4 py-2" onClick={() => setConfirmOpen(false)}>Cancel</button>
              <button type="button" disabled={deletingLoading} className="rounded-xl bg-red-600 px-4 py-2 text-white font-bold" onClick={confirmDelete}>
                {deletingLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

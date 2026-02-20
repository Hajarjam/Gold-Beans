const Client = require("../models/client.model");
const Coffee = require("../models/coffee.model");
const Subscription = require("../models/subscription.model");
const normalizeRole = (role) => (role === "user" ? "client" : role);

const getAllClients = async ({ search = "", sort = "firstNameAsc", role = "" } = {}) => {
  let clients = await Client.find(
    role ? { role } : {}
  ).select("firstName lastName email role isActive createdAt").lean();



  // filter search
  if (search) {
    const s = String(search).toLowerCase();
    clients = clients.filter((c) => {
      const text = `${c.firstName || ""} ${c.lastName || ""} ${c.email || ""} ${c.role || ""}`.toLowerCase();
      return text.includes(s);
    });
  }

  // sort
  const key =
    sort === "lastNameAsc" || sort === "lastNameDesc" ? "lastName" : "firstName";
  const dir = sort.endsWith("Desc") ? -1 : 1;

  clients.sort((a, b) => {
    const A = (a[key] || "").toLowerCase();
    const B = (b[key] || "").toLowerCase();
    return A.localeCompare(B) * dir;
  });

  return clients.map((c) => ({ ...c, role: normalizeRole(c.role) }));
};


const safeClient = "firstName lastName email role isActive createdAt updatedAt";

const getClientById = async (id) => {
  const client = await Client.findById(id).select(safeClient).lean();
  if (!client) throw new Error("Client introuvable");
  client.role = normalizeRole(client.role);
  return client;
};

const createClient = async (payload) => {
  if (!payload.email || !payload.password) throw new Error("Email et mot de passe requis");

  const exists = await Client.findOne({ email: payload.email });
  if (exists) throw new Error("Email déjà utilisé");

  const client = new Client({
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    password: payload.password,
    role: normalizeRole(payload.role || "client"),
    isActive: payload.isActive ?? true,
  });

  await client.save();

  const obj = client.toObject();
  delete obj.password;
  return obj;
};

const updateClient = async (id, payload) => {
  const updated = await Client.findByIdAndUpdate(
    id,
    {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      role: normalizeRole(payload.role),
      isActive: payload.isActive,
    },
    { new: true, runValidators: true }
  ).select("firstName lastName email role isActive createdAt");

  if (!updated) throw new Error("Client introuvable");
  return updated;
};

const deleteClient = async (id) => {
  const deleted = await Client.findByIdAndDelete(id);
  if (!deleted) throw new Error("Client introuvable");
  return true;
};

const getProfile = async (id) => {
  return getClientById(id);
};

const updateProfile = async (id, payload) => {
  const updates = {};
  if (payload.firstName !== undefined) updates.firstName = payload.firstName;
  if (payload.lastName !== undefined) updates.lastName = payload.lastName;
  if (payload.email !== undefined) updates.email = payload.email;

  if (updates.email) {
    const exists = await Client.findOne({ email: updates.email, _id: { $ne: id } });
    if (exists) throw new Error("Email dÃ©jÃ  utilisÃ©");
  }

  const updated = await Client.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  }).select("firstName lastName email role isActive createdAt updatedAt");

  if (!updated) throw new Error("Client introuvable");
  return updated;
};

const updatePassword = async (id, payload) => {
  const currentPassword = payload.currentPassword || payload.oldPassword;
  const nextPassword = payload.newPassword || payload.password;

  if (!currentPassword || !nextPassword) {
    throw new Error("Mot de passe actuel et nouveau mot de passe requis");
  }

  const client = await Client.findById(id);
  if (!client) throw new Error("Client introuvable");

  const isMatch = await client.comparePassword(currentPassword);
  if (!isMatch) throw new Error("Mot de passe actuel incorrect");

  client.password = nextPassword;
  await client.save();
  return { ok: true };
};

const deleteAccount = async (id) => {
  await deleteClient(id);
  return { ok: true };
};

const getDashboard = async (id) => {
  const coffeesPreview = await Coffee.find()
    .select("name price roastLevel images")
    .sort({ createdAt: -1 })
    .limit(4)
    .lean();

  const subscriptionsPreview = await Subscription.find({ client: id })
    .populate("coffee", "name images price")
    .sort({ createdAt: -1 })
    .limit(3)
    .lean();

  return {
    coffeesPreview,
    subscriptionsPreview,
    historyPreview: subscriptionsPreview,
  };
};

module.exports = {
  getAllClients,
  createClient,
  updateClient,
  deleteClient,
  getClientById,
  getProfile,
  updateProfile,
  updatePassword,
  deleteAccount,
  getDashboard,
};

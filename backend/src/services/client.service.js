const Client = require("../models/client.model");
const User = require("../models/user.model");
const Coffee = require("../models/coffee.model");
const Subscription = require("../models/subscription.model");

const normalizeRole = (role) => (role === "user" ? "client" : role);
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const accountModelBySource = (source) => (source === "user" ? User : Client);

const getAllClients = async ({ search = "", sort = "firstNameAsc", role = "" } = {}) => {
  let clients = await Client.find(role ? { role } : {})
    .select("firstName lastName email role isActive createdAt")
    .lean();

  if (search) {
    const s = String(search).toLowerCase();
    clients = clients.filter((c) => {
      const text = `${c.firstName || ""} ${c.lastName || ""} ${c.email || ""} ${c.role || ""}`.toLowerCase();
      return text.includes(s);
    });
  }

  const key = sort === "lastNameAsc" || sort === "lastNameDesc" ? "lastName" : "firstName";
  const dir = sort.endsWith("Desc") ? -1 : 1;

  clients.sort((a, b) => {
    const A = (a[key] || "").toLowerCase();
    const B = (b[key] || "").toLowerCase();
    return A.localeCompare(B) * dir;
  });

  return clients.map((c) => ({ ...c, role: normalizeRole(c.role) }));
};

const safeClient = "firstName lastName email phone role isActive createdAt updatedAt";

const getClientById = async (id) => {
  const client = await Client.findById(id).select(safeClient).lean();
  if (!client) throw new Error("Client introuvable");
  client.role = normalizeRole(client.role);
  return client;
};

const resolveClientIdentity = async (id, email) => {
  if (id) {
    const byId = await Client.findById(id);
    if (byId) return { account: byId, source: "client" };
  }

  const normalizedEmail = String(email || "").trim();
  if (normalizedEmail) {
    const byClientEmail = await Client.findOne({
      email: { $regex: `^${escapeRegex(normalizedEmail)}$`, $options: "i" },
    });
    if (byClientEmail) return { account: byClientEmail, source: "client" };
  }

  if (id) {
    const byUserId = await User.findById(id);
    if (byUserId) return { account: byUserId, source: "user" };
  }

  if (!normalizedEmail) return { account: null, source: null };
  const byUserEmail = await User.findOne({
    email: { $regex: `^${escapeRegex(normalizedEmail)}$`, $options: "i" },
  });
  if (byUserEmail) return { account: byUserEmail, source: "user" };

  return { account: null, source: null };
};

const resolveSubscriptionOwnerIds = async (id, email) => {
  const ids = new Set();
  const normalizedEmail = String(email || "").trim();

  if (id) {
    ids.add(String(id));

    const [clientById, userById] = await Promise.all([
      Client.findById(id).select("_id").lean(),
      User.findById(id).select("_id").lean(),
    ]);

    if (clientById?._id) ids.add(String(clientById._id));
    if (userById?._id) ids.add(String(userById._id));
  }

  if (normalizedEmail) {
    const emailFilter = {
      email: { $regex: `^${escapeRegex(normalizedEmail)}$`, $options: "i" },
    };

    const [clientByEmail, userByEmail] = await Promise.all([
      Client.findOne(emailFilter).select("_id").lean(),
      User.findOne(emailFilter).select("_id").lean(),
    ]);

    if (clientByEmail?._id) ids.add(String(clientByEmail._id));
    if (userByEmail?._id) ids.add(String(userByEmail._id));
  }

  return Array.from(ids);
};

const createClient = async (payload) => {
  if (!payload.email || !payload.password) throw new Error("Email et mot de passe requis");

  const exists = await Client.findOne({ email: payload.email });
  if (exists) throw new Error("Email deja utilise");

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
      phone: payload.phone,
      role: normalizeRole(payload.role),
      isActive: payload.isActive,
    },
    { new: true, runValidators: true }
  ).select("firstName lastName email phone role isActive createdAt");

  if (!updated) throw new Error("Client introuvable");
  return updated;
};

const deleteClient = async (id) => {
  const deleted = await Client.findByIdAndDelete(id);
  if (!deleted) throw new Error("Client introuvable");
  return true;
};

const getProfile = async (id, email) => {
  const { account } = await resolveClientIdentity(id, email);
  if (!account) throw new Error("Client introuvable");

  const profile = account.toObject();
  delete profile.password;
  profile.role = normalizeRole(profile.role);
  return profile;
};

const updateProfile = async (id, payload, email) => {
  const { account, source } = await resolveClientIdentity(id, email);
  if (!account) throw new Error("Client introuvable");

  const Model = accountModelBySource(source);
  const targetId = account._id;
  const updates = {};
  if (payload.firstName !== undefined) updates.firstName = payload.firstName;
  if (payload.lastName !== undefined) updates.lastName = payload.lastName;
  if (payload.email !== undefined) updates.email = payload.email;
  if (payload.phone !== undefined) updates.phone = payload.phone;

  if (updates.email) {
    const exists = await Model.findOne({ email: updates.email, _id: { $ne: targetId } });
    if (exists) throw new Error("Email deja utilise");
  }

  const updated = await Model.findByIdAndUpdate(targetId, updates, {
    new: true,
    runValidators: true,
  }).select("firstName lastName email phone role isActive createdAt updatedAt");

  if (!updated) throw new Error("Client introuvable");
  return updated;
};

const updatePassword = async (id, payload, email) => {
  const currentPassword = payload.currentPassword || payload.oldPassword;
  const nextPassword = payload.newPassword || payload.password;

  if (!currentPassword || !nextPassword) {
    throw new Error("Mot de passe actuel et nouveau mot de passe requis");
  }

  const { account } = await resolveClientIdentity(id, email);
  if (!account) throw new Error("Client introuvable");

  const isMatch = await account.comparePassword(currentPassword);
  if (!isMatch) throw new Error("Mot de passe actuel incorrect");

  account.password = nextPassword;
  await account.save();
  return { ok: true };
};

const deleteAccount = async (id, email) => {
  const { account, source } = await resolveClientIdentity(id, email);
  if (!account) throw new Error("Client introuvable");
  await accountModelBySource(source).findByIdAndDelete(account._id);
  return { ok: true };
};

const getDashboard = async (id, email) => {
  const { account } = await resolveClientIdentity(id, email);
  if (!account) throw new Error("Client introuvable");
  const subscriptionOwnerIds = await resolveSubscriptionOwnerIds(account._id, account.email);

  const coffeesPreview = await Coffee.find()
    .select("name price roastLevel images")
    .sort({ createdAt: -1 })
    .limit(4)
    .lean();

  const allSubscriptions = await Subscription.find({
    client: { $in: subscriptionOwnerIds.length ? subscriptionOwnerIds : [account._id] },
  })
    .populate("coffee", "name images price")
    .sort({ createdAt: -1 })
    .lean();

  const subscriptionsPreview = allSubscriptions
    .filter((sub) => sub.status === "Active")
    .slice(0, 3);

  const historyPreview = allSubscriptions.slice(0, 6);

  return {
    coffeesPreview,
    subscriptionsPreview,
    historyPreview,
    currentSubscriptions: subscriptionsPreview,
    subscriptionHistory: historyPreview,
  };
};

const getAddresses = async (id, email) => {
  const { account } = await resolveClientIdentity(id, email);
  if (!account) throw new Error("Client introuvable");

  return Array.isArray(account.addresses) ? account.addresses : [];
};

const addAddress = async (id, address, email) => {
  const { account } = await resolveClientIdentity(id, email);
  if (!account) throw new Error("Client introuvable");

  const normalizedAddress = {
    street: String(address?.street || "").trim(),
    city: String(address?.city || "").trim(),
    zip: String(address?.zip || "").trim(),
    country: String(address?.country || "Morocco").trim() || "Morocco",
  };

  if (!normalizedAddress.street || !normalizedAddress.city || !normalizedAddress.zip) {
    throw new Error("street, city, zip are required");
  }

  if (!Array.isArray(account.addresses)) account.addresses = [];
  account.addresses.push(normalizedAddress);
  await account.save();

  return normalizedAddress;
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
  getAddresses,
  addAddress,
};

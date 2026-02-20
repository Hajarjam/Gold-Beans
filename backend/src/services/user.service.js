const userRepo = require("../repositories/user.repository");

const normalizeRole = (role) => (role === "user" ? "client" : role);

const sanitize = (user) => {
  if (!user) return user;
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  obj.role = normalizeRole(obj.role);
  return obj;
};

const getAllUsers = async ({ search = "", role = "" } = {}) => {
  const filter = role ? { role: normalizeRole(role) } : {};
  let users = await userRepo.findAll(filter);

  if (search) {
    const s = String(search).toLowerCase();
    users = users.filter((u) =>
      `${u.firstName || ""} ${u.lastName || ""} ${u.email || ""} ${u.role || ""}`
        .toLowerCase()
        .includes(s)
    );
  }

  return users.map(sanitize);
};

const getUserById = async (id) => {
  const user = await userRepo.findById(id);
  if (!user) throw new Error("User introuvable");
  return sanitize(user);
};

const createUser = async (payload) => {
  const exists = await userRepo.findByEmail(payload.email);
  if (exists) throw new Error("Email deja utilise");

  const created = await userRepo.createUser({
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    password: payload.password,
    role: normalizeRole(payload.role || "client"),
    isActive: payload.isActive ?? true,
  });

  return sanitize(created);
};

const updateUser = async (id, payload) => {
  const updates = {};
  if (payload.firstName !== undefined) updates.firstName = payload.firstName;
  if (payload.lastName !== undefined) updates.lastName = payload.lastName;
  if (payload.email !== undefined) updates.email = payload.email;
  if (payload.password !== undefined) updates.password = payload.password;
  if (payload.role !== undefined) updates.role = normalizeRole(payload.role);
  if (payload.isActive !== undefined) updates.isActive = payload.isActive;

  const updated = await userRepo.updateUser(id, updates);
  if (!updated) throw new Error("User introuvable");
  return sanitize(updated);
};

const deleteUser = async (id) => {
  const deleted = await userRepo.deleteUser(id);
  if (!deleted) throw new Error("User introuvable");
  return true;
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };

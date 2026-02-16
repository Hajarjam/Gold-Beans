const User = require("../models/user.model");

const getAllUsers = async ({ search = "", sort = "firstNameAsc", role = "" } = {}) => {
  let users = await User.find(
    role ? { role } : {}
  ).select("firstName lastName email role isActive createdAt").lean();



  // filter search
  if (search) {
    const s = String(search).toLowerCase();
    users = users.filter((u) => {
      const text = `${u.firstName || ""} ${u.lastName || ""} ${u.email || ""} ${u.role || ""}`.toLowerCase();
      return text.includes(s);
    });
  }

  // sort
  const key =
    sort === "lastNameAsc" || sort === "lastNameDesc" ? "lastName" : "firstName";
  const dir = sort.endsWith("Desc") ? -1 : 1;

  users.sort((a, b) => {
    const A = (a[key] || "").toLowerCase();
    const B = (b[key] || "").toLowerCase();
    return A.localeCompare(B) * dir;
  });

  return users;
};


const safeUser = "firstName lastName email role isActive createdAt updatedAt";

const getUserById = async (id) => {
  const user = await User.findById(id).select(safeUser).lean();
  if (!user) throw new Error("Utilisateur introuvable");
  return user;
};

const createUser = async (payload) => {
  if (!payload.email || !payload.password) throw new Error("Email et mot de passe requis");

  const exists = await User.findOne({ email: payload.email });
  if (exists) throw new Error("Email déjà utilisé");

  // IMPORTANT: utiliser new User().save() pour déclencher le pre('save') qui hash le password
  const user = new User({
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    password: payload.password,
    role: payload.role || "client",
    isActive: payload.isActive ?? true,
  });

  await user.save();

  const obj = user.toObject();
  delete obj.password;
  return obj;
};

const updateUser = async (id, payload) => {
  // on n'update pas le password ici (sinon faut re-hash)
  const updated = await User.findByIdAndUpdate(
    id,
    {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      role: payload.role,
      isActive: payload.isActive,
    },
    { new: true, runValidators: true }
  ).select("firstName lastName email role isActive createdAt");

  if (!updated) throw new Error("User introuvable");
  return updated;
};

const deleteUser = async (id) => {
  const deleted = await User.findByIdAndDelete(id);
  if (!deleted) throw new Error("User introuvable");
  return true;
};

module.exports = { getAllUsers, createUser, updateUser, deleteUser, getUserById };

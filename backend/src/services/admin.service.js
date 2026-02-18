const User = require("../models/user.model");

const sanitize = (u) => {
  const obj = u?.toObject ? u.toObject() : u;
  if (!obj) return obj;
  delete obj.password;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpires;
  delete obj.activationToken;
  return obj;
};

// ✅ GET /api/admins?search=&sort=
const getAllAdmins = async ({ search = "", sort = "firstNameAsc" } = {}) => {
  const q = { role: "admin" };

  if (search?.trim()) {
    const s = search.trim();
    q.$or = [
      { firstName: { $regex: s, $options: "i" } },
      { lastName: { $regex: s, $options: "i" } },
      { email: { $regex: s, $options: "i" } },
    ];
  }

  const sortMap = {
    firstNameAsc: { firstName: 1 },
    firstNameDesc: { firstName: -1 },
    lastNameAsc: { lastName: 1 },
    lastNameDesc: { lastName: -1 },
  };

  const admins = await User.find(q)
    .select("-password -resetPasswordToken -resetPasswordExpires -activationToken")
    .sort(sortMap[sort] || sortMap.firstNameAsc)
    .lean();

  return admins;
};

// ✅ POST /api/admins
const createAdmin = async (payload) => {
  const exists = await User.findOne({ email: payload.email });
  if (exists) throw new Error("Email déjà utilisé");

  const user = await User.create({
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    password: payload.password,
    role: "admin",                 // 🔥 forced
    isActive: payload.isActive ?? true,
  });

  return sanitize(user);
};

// ✅ PUT /api/admins/:id
const updateAdmin = async (id, payload) => {
  const admin = await User.findOne({ _id: id, role: "admin" });
  if (!admin) throw new Error("Admin introuvable");

  if (payload.email && payload.email !== admin.email) {
    const exists = await User.findOne({ email: payload.email });
    if (exists) throw new Error("Email déjà utilisé");
  }

  admin.firstName = payload.firstName ?? admin.firstName;
  admin.lastName = payload.lastName ?? admin.lastName;
  admin.email = payload.email ?? admin.email;
  admin.isActive = payload.isActive ?? admin.isActive;

  // password optional
  if (payload.password?.trim()) {
    admin.password = payload.password; // pre("save") will hash
  }

  // role stays admin
  admin.role = "admin";

  await admin.save();
  return sanitize(admin);
};

// ✅ DELETE /api/admins/:id
const deleteAdmin = async (id) => {
  const admin = await User.findOne({ _id: id, role: "admin" });
  if (!admin) throw new Error("Admin introuvable");
  await User.findByIdAndDelete(id);
  return true;
};

// ✅ GET /api/admins/me (requires auth)
const getMyAdminProfile = async (userId) => {
  const me = await User.findById(userId)
    .select("-password -resetPasswordToken -resetPasswordExpires -activationToken")
    .lean();
  if (!me || me.role !== "admin") throw new Error("Accès refusé");
  return me;
};

module.exports = {
  getAllAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  getMyAdminProfile,
};

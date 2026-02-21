const jwt = require("jsonwebtoken");
const clientRepo = require("../repositories/client.repository");
const userRepo = require("../repositories/user.repository");

const normalizeRole = (role) => (role === "user" ? "client" : role);

const findAccountById = async (id, source) => {
  if (source === "client") {
    const client = await clientRepo.findById(id);
    if (client) return client;
    return userRepo.findById(id);
  }

  if (source === "user") {
    const user = await userRepo.findById(id);
    if (user) return user;
    return clientRepo.findById(id);
  }

  const client = await clientRepo.findById(id);
  if (client) return client;
  return userRepo.findById(id);
};

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token manquant" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await findAccountById(decoded.id, decoded.source);

    if (!user) return res.status(401).json({ message: "Utilisateur non trouve" });

    req.user = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: normalizeRole(user.role),
    };
    next();
  } catch (err) {
    res.status(401).json({ message: "Token invalide" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Acces interdit" });
  next();
};

module.exports = { authenticate, isAdmin };

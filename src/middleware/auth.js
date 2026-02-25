const jwt = require("jsonwebtoken");
const prisma = require("../utils/prisma");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) {
      return res.status(401).json({ message: "Token is not valid" });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user && (req.user.role === "ADMIN" || req.user.role === "DOCTOR")) {
    next();
  } else {
    res.status(403).json({ message: "Access denied, admin or doctor only" });
  }
};

module.exports = { authMiddleware, adminMiddleware };

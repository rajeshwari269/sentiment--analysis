const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_USER_SECRET = process.env.JWT_USER_SECRET;

async function jwtmiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token missing or malformed" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_USER_SECRET);
    req.userid = decoded.userId;

    next();
  } catch (e) {
    console.error("JWT Middleware Error:", e.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = jwtmiddleware;

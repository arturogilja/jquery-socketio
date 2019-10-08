const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) return res.status(401).json({ msg: "Acceso denegado" });

  try {
    const decoded = jwt.verify(token, "llavesecreta");
    req.userid = decoded.sub;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ msg: "Acceso denegado" });
  }
};

import jwt from "jsonwebtoken";
import User from "../model/User.js";

const protectRoute = async (req, res, next) => {
  // Verify if exists token
  const { _token } = req.cookies;
  if (!_token) return res.redirect("/auth/login");

  // Validate token
  try {
    const decoded = jwt.verify(_token, process.env.JWT_SECRET);
    const user = await User.scope("deletePassword").findByPk(decoded.id);

    // Save user in request
    if (user) {
      req.user = user;
    } else {
      return res.redirect("/auth/login");
    }
    next();
  } catch (error) {
    return res.clearCookie("_token").redirect("/auth/login");
  }
};

export default protectRoute;
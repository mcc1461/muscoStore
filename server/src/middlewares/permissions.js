"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | MusCo Dev
------------------------------------------------------- */
// permissions.js | Middleware

// Use environment variable to control tempBypass
const tempBypass =
  process.env.TEMP_BYPASS === "true" && process.env.NODE_ENV !== "production";

module.exports = {
  isLogin: (req, res, next) => {
    if (tempBypass || (req.user && req.user._id && req.user.isActive)) {
      next();
    } else {
      res
        .status(401)
        .json({ error: true, message: "NoPermission: You must login." });
    }
  },

  isAdmin: (req, res, next) => {
    if (
      tempBypass ||
      (req.user && req.user.role === "admin" && req.user.isActive)
    ) {
      next();
    } else {
      res
        .status(403)
        .json({ error: true, message: "NoPermission: Admin access required." });
    }
  },

  isStaff: (req, res, next) => {
    if (
      tempBypass ||
      (req.user &&
        (req.user.role === "staff" || req.user.role === "admin") &&
        req.user.isActive)
    ) {
      next();
    } else {
      res
        .status(403)
        .json({ error: true, message: "NoPermission: Staff access required." });
    }
  },
};

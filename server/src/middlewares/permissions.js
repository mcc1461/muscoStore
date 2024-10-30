"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | MusCo Dev
------------------------------------------------------- */
// permissions.js | Middleware

module.exports = {
  isAdmin: (req, res, next) => {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      return res
        .status(403)
        .json({ error: true, message: "Access denied. Admins only." });
    }
  },

  isStaff: (req, res, next) => {
    if (req.user && req.user.role === "staff") {
      next();
    } else {
      return res
        .status(403)
        .json({ error: true, message: "Access denied. Staff only." });
    }
  },

  isStaffOrAdmin: (req, res, next) => {
    if (req.user && (req.user.role === "staff" || req.user.role === "admin")) {
      next();
    } else {
      return res
        .status(403)
        .json({ error: true, message: "Access denied. Staff or Admins only." });
    }
  },

  isUser: (req, res, next) => {
    if (req.user && req.user.role === "user") {
      next();
    } else {
      return res
        .status(403)
        .json({ error: true, message: "Access denied. Users only." });
    }
  },
};

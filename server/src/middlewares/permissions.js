("use strict");
/* -------------------------------------------------------
    NODEJS EXPRESS | MusCo Dev
------------------------------------------------------- */
// Middleware: permissions

module.exports = {
  isLogin: (req, res, next) => {
    const tempBypass = true; // Set this to true to temporarily bypass the check
    if (tempBypass || (req.user && req.user._id && req.user.isActive)) {
      next();
    } else {
      res
        .status(403)
        .send({ error: true, message: "NoPermission: You must login." });
    }
  },

  isAdmin: (req, res, next) => {
    const tempBypass = true; // Set this to true to temporarily bypass the check

    if (tempBypass || (req.user && req.user.isActive)) {
      next();
    } else {
      res.errorStatusCode = 403;
      throw new Error("NoPermission: You must login.");
    }
  },

  isStaff: (req, res, next) => {
    const tempBypass = true; // Set this to true to temporarily bypass the check

    if (tempBypass || (req.user && req.user.isActive)) {
      next();
    } else {
      res.errorStatusCode = 403;
      throw new Error("NoPermission: You must login.");
    }
  },
};

("use strict");
/* -------------------------------------------------------
    NODEJS EXPRESS | MusCo Dev
------------------------------------------------------- */
const router = require("express").Router();
/* ------------------------------------------------------- */
// routes/user:

const { isAdmin, isStaff, isLogin } = require("../middlewares/permissions");
const { list, create, read, update, remove } = require("../controllers/user");
const { login, logout } = require("../controllers/auth");

// URL: /users

router.route("/").get(isStaff, list).post(create);

router
  .route("/:id")
  .get(isLogin, read)
  .put(isStaff, update)
  .patch(isStaff, update)
  .delete(isAdmin, remove);

router.route("/login", isLogin).post(login);

router.route("/logout", isLogin).post(logout);

/* ------------------------------------------------------- */
module.exports = router;

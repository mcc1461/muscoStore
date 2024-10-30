"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | MusCo Dev
------------------------------------------------------- */
const express = require("express");
const router = express.Router();

/* ------------------------------------------------------- */
// routes/user:

const { isAdmin, isLogin } = require("../middlewares/permissions");
const { list, create, read, update, remove } = require("../controllers/user"); // Import the controller functions

// URL: /users

// Protect routes with authentication middleware as needed
router.route("/").get(isLogin, list).post(create);

router
  .route("/:id")
  .get(isLogin, read)
  .put(isLogin, update)
  .patch(isLogin, update)
  .delete(isAdmin, remove);

/* ------------------------------------------------------- */
module.exports = router;

"use strict";
const router = require("express").Router();

// router.get("/users", (req, res) => {
//   res.send("Hello from users");
// });

// Sub-routes
router.use("/auth", require("./auth"));
router.use("/users", require("./user")); // This should ensure /api/users works
router.use("/tokens", require("./token"));
router.use("/categories", require("./category"));
router.use("/brands", require("./brand"));
router.use("/firms", require("./firm"));
router.use("/products", require("./productRoutes"));
router.use("/purchases", require("./purchase"));
router.use("/sales", require("./sale"));
router.use("/documents", require("./document"));

module.exports = router;

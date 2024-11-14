"use strict";

const router = require("express").Router();
const permissions = require("../middlewares/permissions");
const brandController = require("../controllers/brand");
const authenticate = require("../middlewares/authentication"); // Import authenticate middleware

// Apply authentication middleware to all routes in this router
router.use(authenticate);

// GET /api/brands - Accessible to all authenticated users
router.get("/", brandController.list);

// POST /api/brands - Accessible to staff and admin
router.post("/", permissions.isStaffOrAdmin, brandController.create);

// GET /api/brands/:id - Accessible to all authenticated users
router.get("/:id", brandController.read);

// PUT /api/brands/:id - Accessible to staff and admin
router.put("/:id", permissions.isStaffOrAdmin, brandController.update);

// PATCH /api/brands/:id - Accessible to staff and admin
router.patch("/:id", permissions.isStaffOrAdmin, brandController.update);

// DELETE /api/brands/:id - Accessible only to admin
router.delete("/:id", permissions.isAdmin, brandController.delete);

module.exports = router;

"use strict";

const router = require("express").Router();
const permissions = require("../middlewares/permissions");
const firmController = require("../controllers/firm");
const authenticate = require("../middlewares/authentication"); // Import authenticate middleware

// Apply authentication middleware to all routes in this router
router.use(authenticate);

// GET /api/firms - Accessible to all authenticated users
router.get("/", firmController.list);

// POST /api/firms - Accessible to staff and admin
router.post("/", permissions.isStaffOrAdmin, firmController.create);

// GET /api/firms/:id - Accessible to all authenticated users
router.get("/:id", firmController.read);

// PUT /api/firms/:id - Accessible to staff and admin
router.put("/:id", permissions.isStaffOrAdmin, firmController.update);

// PATCH /api/firms/:id - Accessible to staff and admin
router.patch("/:id", permissions.isStaffOrAdmin, firmController.update);

// DELETE /api/firms/:id - Accessible only to admin
router.delete("/:id", permissions.isAdmin, firmController.delete);

module.exports = router;

"use strict";
const User = require("../models/user");

module.exports = {
  // List users (Admin sees all, non-admin sees only their own profile)
  list: async (req, res) => {
    try {
      const filters = req.user?.isAdmin ? {} : { _id: req.user?._id };
      const data = await User.find(filters);

      if (!data || data.length === 0) {
        return res.status(404).send({
          error: true,
          message: "No users found.",
          data: [],
        });
      }

      res.status(200).send({
        error: false,
        details: await res.getModelListDetails(User),
        data,
      });
    } catch (error) {
      res.status(500).send({ error: true, message: error.message });
    }
  },

  // Create a new user
  create: async (req, res) => {
    const { username, password, email, firstName, lastName, role, roleCode } =
      req.body;

    let assignedRole = "user";

    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res
          .status(400)
          .json({ error: true, message: "User already exists." });
      }

      // Check the role and roleCode
      if (role === "admin" && roleCode === process.env.ADMIN_CODE) {
        assignedRole = "admin";
      } else if (role === "staff" && roleCode === process.env.STAFF_CODE) {
        assignedRole = "staff";
      } else if (role === "user") {
        assignedRole = "user";
      } else {
        return res
          .status(400)
          .json({ error: true, message: "Invalid role or role code." });
      }

      // Create the new user (No password hashing)
      const newUser = new User({
        username,
        password, // Store the plain password
        email,
        firstName,
        lastName,
        role: assignedRole,
      });

      await newUser.save();

      return res.status(201).send({
        error: false,
        message: "User registered successfully.",
        user: {
          _id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          role: newUser.role,
        },
      });
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({ error: true, message: "Server error." });
    }
  },

  // Read a single user
  read: async (req, res) => {
    const filters = req.user?.isAdmin
      ? { _id: req.params?.id }
      : { _id: req.user?._id };

    try {
      const data = await User.findOne(filters);

      if (!data) {
        return res
          .status(404)
          .send({ error: true, message: "User not found." });
      }

      return res.status(200).send({
        error: false,
        data,
      });
    } catch (error) {
      res.status(500).send({ error: true, message: error.message });
    }
  },

  // Update a user's profile
  update: async (req, res) => {
    const filters = req.user?.isAdmin
      ? { _id: req.params?.id }
      : { _id: req.user?._id };

    req.body.isAdmin = req.user?.isAdmin ? req.body.isAdmin : false;

    try {
      const data = await User.updateOne(filters, req.body, {
        runValidators: true,
      });

      if (data.nModified === 0) {
        return res.status(404).send({
          error: true,
          message: "No changes made to the user.",
        });
      }

      const updatedData = await User.findOne(filters);

      return res.status(202).send({
        error: false,
        message: "User updated successfully.",
        new: updatedData,
      });
    } catch (error) {
      res.status(500).send({ error: true, message: error.message });
    }
  },

  // Remove (delete) a user
  remove: async (req, res) => {
    const filters = req.user?.isAdmin
      ? { _id: req.params?.id }
      : { _id: req.user?._id };

    try {
      const data = await User.deleteOne(filters);

      if (data.deletedCount === 0) {
        return res.status(404).send({
          error: true,
          message: "User not found or could not be deleted.",
        });
      }

      return res.status(204).send({
        error: false,
        message: "User deleted successfully.",
      });
    } catch (error) {
      res.status(500).send({ error: true, message: error.message });
    }
  },
};

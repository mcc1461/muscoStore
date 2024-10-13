("use strict");
const User = require("../models/user");
const Token = require("../models/token");
const passwordEncrypt = require("../helpers/passwordEncrypt");

module.exports = {
  // List users (Admin sees all, non-admin sees only their own profile)
  list: async (req, res) => {
    /*
      #swagger.tags = ["Users"]
      #swagger.summary = "List Users"
      #swagger.description = `
        This endpoint allows users to list all registered users.
        <br><br><b>Admin</b>: Lists all users.
        <br><b>Non-admin</b>: Only sees their own profile.
      `
    */
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
    /*
      #swagger.tags = ["Users"]
      #swagger.summary = "Create User"
      #swagger.parameters['body'] = {
          in: 'body',
          required: true,
          schema: {
              "username": "test",
              "password": "1234",
              "email": "test@site.com",
              "firstName": "test",
              "lastName": "test"
          }
      }
    */
    req.body.isStaff = false;
    req.body.isAdmin = false;

    try {
      const data = await User.create(req.body);

      if (data && data._id) {
        const tokenData = await Token.create({
          userId: data._id,
          token: passwordEncrypt(data._id + Date.now()),
        });

        return res.status(201).send({
          error: false,
          token: tokenData.token,
          data,
        });
      } else {
        return res.status(400).send({
          error: true,
          message: "User creation failed.",
        });
      }
    } catch (error) {
      res.status(500).send({ error: true, message: error.message });
    }
  },

  // Read a single user (Admin can access any user, non-admin can only access their own profile)
  read: async (req, res) => {
    /*
      #swagger.tags = ["Users"]
      #swagger.summary = "Get Single User"
      #swagger.description = `
        This endpoint allows an admin to get any user by ID, or non-admin users to retrieve their own profile.
      `
    */
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

  // Update a user's profile (Admin can update any user, non-admin can update only their own profile)
  update: async (req, res) => {
    /*
      #swagger.tags = ["Users"]
      #swagger.summary = "Update User"
      #swagger.parameters['body'] = {
          in: 'body',
          required: true,
          schema: {
              "username": "test",
              "password": "1234",
              "email": "test@site.com",
              "firstName": "test",
              "lastName": "test"
          }
      }
      #swagger.description = `
        This endpoint allows an admin to update any user's details by ID, or non-admin users to update their own profile.
      `
    */
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

  // Remove (delete) a user (Admin can delete any user, non-admin can delete only their own profile)
  remove: async (req, res) => {
    /*
      #swagger.tags = ["Users"]
      #swagger.summary = "Delete User"
      #swagger.description = `
        This endpoint allows an admin to delete any user by ID, or non-admin users to delete their own profile.
      `
    */
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

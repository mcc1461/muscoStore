"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | MusCo Dev
------------------------------------------------------- */
const { mongoose } = require("../configs/dbConnection");

/* ------------------------------------------------------- */
// User Model:
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      index: true,
    },

    password: {
      type: String,
      trim: true,
      required: true,
    },

    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      index: true,
    },

    firstName: {
      type: String,
      trim: true,
      // required: true,
    },

    lastName: {
      type: String,
      trim: true,
      // required: true,
    },

    photo: {
      type: String,
      required: [false, "No photo."],
      default:
        "https://firebasestorage.googleapis.com/v0/b/musco-store.appspot.com/o/unknowAvatar.png?alt=media&token=e9b3b001-f1f5-4cfa-93d0-402148949c5a",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // Removed 'isStaff' and 'isAdmin' fields
    // Added 'role' field to represent user roles
    role: {
      type: String,
      enum: ["admin", "staff", "user"],
      default: "user",
    },
  },
  { collection: "users", timestamps: true }
);

/* ------------------------------------------------------- */
// Schema Configs:

const passwordEncrypt = require("../helpers/passwordEncrypt");

// Password validation regex
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

// Email validation regex
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

UserSchema.pre(["save", "updateOne"], function (next) {
  // Get data from "this" when creating;
  // If process is updateOne, data will be in "this._update"
  const data = this?._update || this;

  // Email validation
  const isEmailValidated = data.email ? emailRegex.test(data.email) : true;

  if (isEmailValidated) {
    if (data?.password) {
      // Password validation
      const isPasswordValidated = passwordRegex.test(data.password);

      if (isPasswordValidated) {
        // Encrypt the password
        this.password = data.password = passwordEncrypt(data.password);
        if (this._update) {
          this._update.password = this.password; // Ensure password is updated during updateOne
        }
      } else {
        return next(new Error("Password not validated."));
      }
    }

    next(); // Allow to save or update
  } else {
    return next(new Error("Email not validated."));
  }
});

/* ------------------------------------------------------- */
module.exports = mongoose.model("User", UserSchema);

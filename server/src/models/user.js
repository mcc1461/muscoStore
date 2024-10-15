"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | MusCo Dev
------------------------------------------------------- */
const { mongoose } = require("../configs/dbConnection");
const bcrypt = require("bcryptjs");

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
    },

    lastName: {
      type: String,
      trim: true,
    },

    photo: {
      type: String,
      default:
        "https://firebasestorage.googleapis.com/v0/b/musco-store.appspot.com/o/unknowAvatar.png?alt=media&token=e9b3b001-f1f5-4cfa-93d0-402148949c5a",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    role: {
      type: String,
      enum: ["admin", "staff", "user"],
      default: "user",
    },

    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpires: {
      type: Date,
    },
  },
  { collection: "users", timestamps: true }
);

/* ------------------------------------------------------- */
// Schema Configs:

// Password validation regex
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

// Email validation regex
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

/* Pre-save hook to hash the password */
UserSchema.pre("save", async function (next) {
  const user = this;

  // Email validation
  if (!emailRegex.test(user.email)) {
    return next(new Error("Email not validated."));
  }

  // Only hash the password if it is being modified or set for the first time
  if (!user.isModified("password")) {
    return next();
  }

  // Validate password with your custom regex
  const isPasswordValidated = passwordRegex.test(user.password);
  if (!isPasswordValidated) {
    return next(new Error("Password not validated."));
  }

  // Hash the password before saving it
  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/* Pre-update hook to handle password update validation */

  UserSchema.pre("updateOne", async function (next) {
    const update = this.getUpdate();

    // Only hash the password if it’s not already hashed
    if (update.password && !update.isPasswordUpdating) {
      const salt = await bcrypt.genSalt(10);
      update.password = await bcrypt.hash(update.password, salt);
    }

    next();
  });


  // Validate password with your custom regex
  const isPasswordValidated = passwordRegex.test(update.password);
  if (!isPasswordValidated) {
    return next(new Error("Password not validated."));
  }

  // Hash the password before updating it
  try {
    const salt = await bcrypt.genSalt(10);
    update.password = await bcrypt.hash(update.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/* ------------------------------------------------------- */
module.exports = mongoose.model("User", UserSchema);

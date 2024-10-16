const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// User Schema
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

// Password validation regex
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
// Email validation regex
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

// Pre-save hook to hash the password
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    if (!passwordRegex.test(this.password)) {
      return next(new Error("Password does not meet the required criteria."));
    }
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
      return next(err);
    }
  }
  if (this.email && !emailRegex.test(this.email)) {
    return next(new Error("Email is not valid."));
  }
  next();
});

// Pre-update hook to hash the password when updating
UserSchema.pre("findOneAndUpdate", async function (next) {
  if (this._update.password) {
    if (!passwordRegex.test(this._update.password)) {
      return next(new Error("Password does not meet the required criteria."));
    }
    try {
      const salt = await bcrypt.genSalt(10);
      this._update.password = await bcrypt.hash(this._update.password, salt);
    } catch (err) {
      return next(err);
    }
  }
  if (this._update.email && !emailRegex.test(this._update.email)) {
    return next(new Error("Email is not valid."));
  }
  next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);

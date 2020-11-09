const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Jwt = require("jsonwebtoken");
const Joi = require("joi");
const config = require("config");
const ObjectId = mongoose.Schema.Types.ObjectId;
const passwordComplexity = require("joi-password-complexity");

const complexityOptions = {
  min: 6,
  max: 20,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 2,
};

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      maxlength: 30,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      index: true,
      maxlength: 50,
    },
    password: {
      type: String,
      maxlength: 225,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    verified: {
      type: Boolean,
      default: false,
      index: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
    rememberToken: {
      token: {
        type: String,
        default: null,
      },
      expiredDate: {
        type: Date,
        default: null,
      },
    },
    role: {
      type: String,
      required: true,
      enum: ["superAdmin", "admin", "accountant"],
    },
    createdBy: {
      type: ObjectId,
      ref: "Admin",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);


//sign token for this admin
adminSchema.methods.generateToken = function () {
  return Jwt.sign(
    {
      id: this._id,
      email: this.email,
      type: "admin",
    },
    config.get("application.jwt.key"),
    { expiresIn: "3d" }
  );
};

// validate create company
function validateAdmin(body) {
  const schema = Joi.object({
    name: Joi.string().max(30).required(),
    email: Joi.string().max(50).email().required(),
    role: Joi.string().required().valid("superAdmin", "admin", "accountant"),
    password: passwordComplexity(complexityOptions).required(),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  });

  return schema.validate(body);
}

function validateAdminLogin(body) {
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });

  return schema.validate(body);
}

// validate company verification
function validateVerifyAccount(body) {
  const schema = Joi.object({
    email: Joi.string().email().max(50).required(),
    token: Joi.string().max(225).required(),
    type: Joi.string().valid("admin", "company", "rider").required()
  });

  return schema.validate(body);
}

const Admin = mongoose.model("Admin", adminSchema);

module.exports = {
  Admin,
  validateAdmin,
  validateAdminLogin,
  validateVerifyAccount,
};

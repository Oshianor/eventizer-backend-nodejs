const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
const passwordComplexity = require("joi-password-complexity");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const config = require("config");


const complexityOptions = {
  min: 5,
  max: 20,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 2,
};

const organizerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      maxlength: 30,
      default: "",
    },
    email: {
      type: String,
      index: true,
      required: true,
      maxlength: 60,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      maxlength: 225,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
      index: true,
      required: true,
    },
    emailVerified: {
      type: Boolean,
      index: true,
      default: false,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      required: true,
      default: "inactive",
    },
    followers: [ObjectId],
    rememberToken: {
      token: {
        type: String,
        default: null,
        maxlength: 225,
      },
      expiredDate: {
        type: Date,
        default: null,
      },
    },
    logo: {
      type: String,
      default: null,
    },
    totalEvents: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedBy: {
      type: ObjectId,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// generate church token
organizerSchema.methods.generateToken = function () {
  const token = jwt.sign(
    {
      id: this._id,
      email: this.email,
    },
    config.get("application.jwt.key"),
    { expiresIn: config.get("application.jwt.expireDate") }
  );
  return token;
};


const Organizer = mongoose.model("Organizer", organizerSchema);

function validateOrganizer(user) {
  const Schema = Joi.object().keys({
    email: Joi.string().email().label("Email").max(50).required(),
    password: passwordComplexity(complexityOptions)
      .label("Password")
      .required(),
  });

  return Schema.validate(user);
}

function validateVerifyAccount(user) {
  const Schema = Joi.object().keys({
    email: Joi.string().email().label("Email").max(50).required(),
    token: Joi.string().label("Token").max(225).required(),
    type: Joi.string().valid("user", "organizer", "admin").required(),
  });

  return Schema.validate(user);
}

module.exports = {
  Organizer,
  validateOrganizer,
  validateVerifyAccount,
};

const mongoose = require("mongoose");
const Joi = require("joi");
const ObjectId = mongoose.Schema.Types.ObjectId;

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 30,
    },
    pricing: [
      {
        type: ObjectId,
        required: true,
        unique: true,
        ref: "Pricing",
      },
    ],
    pricingType: {
      type: String,
      enum: ["free", "paid"],
      default: "paid",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["public", "private"],
      default: "public",
      required: true,
      index: true,
    },
    location: {
      type: String,
      required: true,
    },
    category: {
      type: ObjectId,
      required: true,
      index: true,
    },
    tags: {
      type: Array,
      required: true,
      index: true,
    },
    tagsString: {
      type: String,
      required: true,
      text: true,
    },
    totalTicket: {
      type: Number,
      required: true,
      default: 0,
    },
    soldTicket: {
      type: String,
      required: true,
      default: 0,
    },
    startDate: {
      type: Date,
      required: true,
      index: true,
    },
    endDate: {
      type: Date,
      required: true,
      index: true,
    },
    paymentDeadline: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);


function validatePricing(data) {
  const Schema = Joi.object().keys({
    name: Joi.string().max(30).label("Plan name").required(),
    features: Joi.array().min(0).label("Plan features").required(),
    priority: Joi.number().min(0).label("Priority").required(),
    transactionCost: Joi.number().min(0).label("Transaction Cost").required(),
    price: Joi.number().min(0).label("Price").required(),
    currency: Joi.string().min(0).label("Format").valid("NGN").required(),
    type: Joi.string()
      .min(0)
      .label("Type")
      .valid("freemium", "premium")
      .required(),
  });

  return Schema.validate(data);
}


function validateUpdatePricing(data) {
  const Schema = Joi.object().keys({
    name: Joi.string().max(30).label("Plan name").optional(),
    features: Joi.array().min(0).label("Plan features").optional(),
    priority: Joi.number().min(0).label("Priority").optional(),
    transactionCost: Joi.number().min(0).label("Transaction Cost").optional(),
    price: Joi.number().min(0).label("Price").optional(),
    currency: Joi.string().min(0).label("Format").valid("NGN").optional(),
    type: Joi.string()
      .min(0)
      .label("Type")
      .valid("freemium", "premium")
      .optional(),
  });

  return Schema.validate(data);
}

const Event = mongoose.model("Event", eventSchema);

module.exports = {
  Event,
  validatePricing,
  validateUpdatePricing,
};

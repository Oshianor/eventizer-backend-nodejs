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
        ref: "Pricing"
      },
    ],
    img: [String],
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
    tagString: {
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
      maxlength: 3000,
    },
  },
  {
    timestamps: true,
  }
);

function validateEvent(data) {
  const Schema = Joi.object().keys({
    name: Joi.string().max(30).label("Event Name").required(),
    type: Joi.array().label("Event Type").valid("public", "private").required(),
    location: Joi.string().label("Location").required(),
    totalTicket: Joi.number().min(1).label("Total Ticket").required(),
    category: Joi.string()
      .label("Category")
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
    pricingType: Joi.string()
      .label("Pricing Type")
      .valid("free", "paid")
      .required(),
    tags: Joi.array().label("Tag").items(Joi.string().required()).required(),
    description: Joi.string().max(3000).allow("").required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    paymentDeadline: Joi.date().required(),
    pricing: Joi.array()
      .items({
        name: Joi.string().max(30).label("Pricing Name").required(),
        ticket: Joi.number().required(),
        price: Joi.number().min(1).required(),
        quantity: Joi.number().required(),
        description: Joi.string().max(225).allow("").required(),
        startDate: Joi.date().required(),
        endDate: Joi.date().required(),
      })
      .optional(),
  });

  return Schema.validate(data);
}

const Event = mongoose.model("Event", eventSchema);

module.exports = {
  Event,
  validateEvent,
};

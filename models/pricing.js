const mongoose = require("mongoose");
const Joi = require("joi");
const ObjectId = mongoose.Schema.Types.ObjectId;


const pricingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 15,
    },
    event: {
      type: ObjectId,
      required: true,
      index: true,
      ref: "Event",
    },
    ticket: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      maxlength: 300,
      required: true,
      default: ""
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
  },
  {
    timestamps: true,
  }
);


const Pricing = mongoose.model("Pricing", pricingSchema);

module.exports = {
  Pricing
};

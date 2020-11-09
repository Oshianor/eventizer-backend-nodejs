const mongoose = require("mongoose");
const Joi = require("joi");

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", categorySchema);

function validateCategory(data) {
  const Schema = Joi.object().keys({
    name: Joi.string().max(30).label("Event Name").required()
  });

  return Schema.validate(data);
}

module.exports = {
  Category,
  validateCategory,
};

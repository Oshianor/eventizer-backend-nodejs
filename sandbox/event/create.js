const { User, validateUser } = require("../../models/users");
const { Organizer } = require("../../models/organizer");
const { Event, validateEvent } = require("../../models/event");
const { Pricing } = require("../../models/pricing");
const { Category } = require("../../models/category");
const config = require("config");
const moment = require("moment");
const { JsonResponse } = require("../../lib/apiResponse");
const { MSG_TYPES } = require("../../constant/msg");
const { AsyncForEach } = require("../../utils");

/**
 * Create event
 * @param {*} req
 * @param {*} res
 */
exports.event = async (req, res) => {
  try {
    // validate request
    const { error } = validateEvent(req.body);
    if (error)
      return JsonResponse(res, 400, error.details[0].message, null, null);

    // check if account exist
    const user = await User.findOne({
      _id: req.user.id,
      type: "organizer",
      verified: true,
      status: "active",
    });
    if (!user)
      return JsonResponse(res, 400, MSG_TYPES.NOT_FOUND, null, null);

    const category = await Category.findById(req.body.category);
    if (!category)
      return JsonResponse(res, 400, MSG_TYPES.NOT_FOUND, null, null);

    req.body.tagString = req.body.tags.toString();
    const newEvent = new Event(req.body);
    

    if (req.body.pricingType === "paid") {
      await AsyncForEach(req.body.pricing, (data, index, arr) => {
        req.body.pricing[index].event = newEvent._id;
      });
      const newPricing = await Pricing.create(req.body.pricing);
      newEvent.pricing = newPricing;
    }

    await newEvent.save();

    JsonResponse(res, 200, MSG_TYPES.CREATED, null, null);
    return;
  } catch (error) {
    console.log(error);
    JsonResponse(res, 500, MSG_TYPES.SERVER_ERROR, null, null);
    return;
  }
};

const config = require("config");
const moment = require("moment");
const { User } = require("../models/users");
const { Organizer } = require("../models/organizer");
const { Event, validateEvent } = require("../models/event");
const { Pricing } = require("../models/pricing");
const { Category } = require("../models/category");
const { JsonResponse } = require("../lib/apiResponse");
const { MSG_TYPES } = require("../constant/msg");
const { AsyncForEach, Paginate } = require("../utils");

/**
 * Create event
 * @param {*} req
 * @param {*} res
 */
exports.create = async (req, res) => {
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
    if (!user) return JsonResponse(res, 400, "This user account not found.");

    const category = await Category.findById(req.body.category);
    if (!category)
      return JsonResponse(res, 400, MSG_TYPES.NOT_FOUND, null, null);

    req.body.tagString = req.body.tags.toString();
    const newEvent = new Event(req.body);

    if (req.body.pricingType === "paid") {
      await AsyncForEach(req.body.pricing, (data, index, arr) => {
        req.body.pricing[index].event = newEvent._id;
      });
      const newPricing = await Pricing.create(JSON.parse(JSON.stringify(req.body.pricing)));
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


/**
 * Get all event that hasn't expired.
 * @param {*} req
 * @param {*} res
 */
exports.all = async (req, res) => {
  try {
    const { page, pageSize, skip } = Paginate(req);

    const currentDate = new Date();
    const event = await Event.find({ endDate: { $gte: currentDate } })
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(skip)
      .populate("pricing");
    const total = await Event.find({ endDate: { $gte: currentDate } }).countDocuments();

    const meta = {
      total,
      pagination: {
        pageSize,
        page: Math.round(total / pageSize),
        currentPage: page,
      },
    };
    JsonResponse(res, 200, MSG_TYPES.FETCHED, event, meta);
    return;
  } catch (error) {
    console.log(error);
    JsonResponse(res, 500, MSG_TYPES.SERVER_ERROR, null, null);
    return;
  }
};

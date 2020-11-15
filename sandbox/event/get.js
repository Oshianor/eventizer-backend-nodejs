const { User } = require("../../models/users");
const { Event } = require("../../models/event");
const { JsonResponse } = require("../../lib/apiResponse");
const mongoose = require("mongoose");
const { MSG_TYPES } = require("../../constant/msg");
const { Paginate } = require("../../utils");


exports.event = async (req, res) => {
  try {
    const { page, pageSize, skip } = Paginate(req);

    const currentDate = new Date();
    const event = await Event.find({ endDate: { $gte: currentDate } })
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(skip);
    const total = await Event.find({ endDate: { $gte: currentDate } });

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

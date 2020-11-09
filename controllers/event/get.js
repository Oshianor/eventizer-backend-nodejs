const { User } = require("../../models/users");
const { JsonResponse } = require("../../lib/apiResponse");
const mongoose = require("mongoose");
const { MSG_TYPES } = require("../../constant/msg");


exports.user = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id, verified: true, status: "active" }).select("-password");

    if (!user) return JsonResponse(res, 404, MSG_TYPES.NOT_FOUND, null, null);

    JsonResponse(res, 200, MSG_TYPES.FETCHED, user, null);
    return;
  } catch (error) {
    console.log(error);
    JsonResponse(res, 500, MSG_TYPES.SERVER_ERROR, null, null);
    return;
  }
};

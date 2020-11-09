const { User, validateLogin } = require("../../models/users");
const { Organizer } = require("../../models/organizer");
const { JsonResponse } = require("../../lib/apiResponse");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { MSG_TYPES } = require("../../constant/msg");


exports.user = async (req, res) => {
  try {
		const { error } = validateLogin(req.body);
		if(error) return JsonResponse(res, 400, error.details[0].message, null, null);

		// find the user trying to login
    const user = await User.findOne({
      email: req.body.email.toLowerCase(),
      verified: true,
      status: "active",
    });
		if (!user) return JsonResponse(res, 400, MSG_TYPES.ACCOUNT_INVALID, null, null);


		// compare request password with the password saved on the database
    let validPassword = await bcrypt.compare(req.body.password, user.password);
		if (!validPassword) return JsonResponse(res, 400, MSG_TYPES.ACCOUNT_INVALID, null, null);

    let token = user.generateToken();

    res.header("x-auth-token", token);
    JsonResponse(res, null, MSG_TYPES.LOGGED_IN, null, null);
    return
	} catch (error) {
		console.log(error);
    JsonResponse(res, 500, MSG_TYPES.SERVER_ERROR, null, null);
    return;
	}
};



exports.organizer = async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error)
      return JsonResponse(res, 400, error.details[0].message, null, null);

    // find the user trying to login
    const organizer = await Organizer.findOne({
      email: req.body.email.toLowerCase(),
      verified: true,
      status: "active",
    });
    if (!organizer)
      return JsonResponse(res, 400, MSG_TYPES.ACCOUNT_INVALID, null, null);

    // compare request password with the password saved on the database
    let validPassword = await bcrypt.compare(
      req.body.password,
      organizer.password
    );
    if (!validPassword)
      return JsonResponse(res, 400, MSG_TYPES.ACCOUNT_INVALID, null, null);

    let token = organizer.generateToken();

    res.header("x-auth-token", token);
    JsonResponse(res, null, MSG_TYPES.LOGGED_IN, null, null);
    return;
  } catch (error) {
    console.log(error);
    JsonResponse(res, 500, MSG_TYPES.SERVER_ERROR, null, null);
    return;
  }
};
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { User, validateLogin } = require("../models/users");
const { Admin, validateAdminLogin } = require("../models/admin");
const { JsonResponse } = require("../lib/apiResponse");
const { MSG_TYPES } = require("../constant/msg");

/**
 * User/Organizer Login
 * @param {*} req
 * @param {*} res
 */
exports.login = async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error)
      return JsonResponse(res, 400, error.details[0].message, null, null);

    // find the user trying to login
    const user = await User.findOne({
      email: req.body.email.toLowerCase(),
      status: "active",
      verified: true,
    });
    if (!user)
      return JsonResponse(res, 400, MSG_TYPES.ACCOUNT_INVALID, null, null);

    // compare request password with the password saved on the database
    let validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword)
      return JsonResponse(res, 400, MSG_TYPES.ACCOUNT_INVALID, null, null);

    let token = user.generateToken();

    res.header("x-auth-token", token);
    JsonResponse(res, null, MSG_TYPES.LOGGED_IN, null, null);
    return;
  } catch (error) {
    console.log(error);
    JsonResponse(res, 500, MSG_TYPES.SERVER_ERROR, null, null);
    return;
  }
};

/**
 * Admin Login
 * @param {*} req
 * @param {*} res
 */
exports.adminLogin = async (req, res) => {
  try {
    const { error } = validateAdminLogin(req.body);

    if (error) {
      return JsonResponse(res, 400, error.details[0].message, null, null);
    }

    const admin = await Admin.findOne({
      email: req.body.email.toLowerCase(),
      verified: true,
      status: "active",
    });
    if (!admin)
      return JsonResponse(res, 401, MSG_TYPES.ACCOUNT_INVALID, null, null);

    // compare request password with the password saved on the database
    let validPassword = await bcrypt.compare(req.body.password, admin.password);
    if (!validPassword)
      return JsonResponse(res, 400, MSG_TYPES.ACCOUNT_INVALID, null, null);

    const token = admin.generateToken();

    delete admin.password;
    res.header("x-auth-token", token);
    JsonResponse(res, 200, MSG_TYPES.LOGGED_IN, null, null);
    return;
  } catch (error) {
    console.log(error);
    return JsonResponse(res, 500, MSG_TYPES.SERVER_ERROR, null, null);
  }
};


exports.verify = async (req, res) => {
  try {
    const { error } = validateVerifyAccount(req.body);
    if (error)
      return JsonResponse(res, 400, error.details[0].message, null, null);

    const currentDate = new Date();

    const dataReq = {
      email: req.body.email,
      "rememberToken.token": req.body.token,
      verified: false,
      emailVerified: false,
      "rememberToken.expiredDate": { $gte: currentDate },
    };

    const dataUpdate = {
      verified: true,
      emailVerified: true,
      rememberToken: null,
      status: "active",
    };

    if (req.body.type === "user") {
      const user = await User.findOne(dataReq);
      if (!user) return JsonResponse(res, 404, MSG_TYPES.NOT_FOUND, null, null);
      await user.updateOne(dataUpdate);
      res.header("x-auth-token", user.generateToken());
      // } else if (req.body.type === "organizer") {
      //   const organizer = await Organizer.findOne(dataReq);
      //   if (!organizer) return JsonResponse(res, 404, MSG_TYPES.NOT_FOUND, null, null);
      //   await organizer.updateOne(dataUpdate);
    } else if (req.body.type === "admin") {
      const admin = await Admin.findOne(dataReq);
      if (!admin)
        return JsonResponse(res, 404, MSG_TYPES.NOT_FOUND, null, null);
      await admin.updateOne(dataUpdate);
    }

    JsonResponse(res, null, MSG_TYPES.ACCOUNT_VERIFIED, null, null);
    return;
  } catch (error) {
    console.log(error);
    return res.status(400).send("Something went wrong");
  }
};
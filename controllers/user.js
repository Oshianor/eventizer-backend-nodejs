const config = require("config");
const moment = require("moment");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const Template = require("../templates");
const { User, validateUser } = require("../models/users");
const { JsonResponse } = require("../lib/apiResponse");
const { MSG_TYPES } = require("../constant/msg");
const { Mailer, GenerateToken } = require("../utils");


exports.create = async (req, res) => {
  try {
    // validate request
    const { error } = validateUser(req.body);
    if (error)
      return JsonResponse(res, 400, error.details[0].message, null, null);

    // check if account exist
    const userExist = await User.findOne({ email: req.body.email });
    if (userExist)
      return JsonResponse(res, 400, MSG_TYPES.ACCOUNT_EXIST, null, null);

    const dir = path.join(__dirname + "../../../constant/states.json");
    const obj = JSON.parse(fs.readFileSync(dir, "utf8"));
    if (!obj.includes(req.body.state))
      return JsonResponse(res, 400, "Please provide a valid state", null, null);

    // create new account record
    const token = GenerateToken(225);

    // const day = req.body.type === "user" ? 30 : 2;
    req.body.rememberToken = {
      token,
      expiredDate: moment().add(req.body.type === "user" ? 30 : 2, "days"),
    };
    const newUser = new User(req.body);
    newUser.password = await bcrypt.hash(newUser.password, 10);
    newUser.email.toLowerCase();
    await newUser.save();

    const subject = "Account Verification Code";
    const html = Template.Verification(token, newUser.email, "user");
    await Mailer(newUser.email, subject, html);

    const authToken = newUser.generateToken();

    res.header("x-auth-token", authToken);
    JsonResponse(res, 200, MSG_TYPES.ACCOUNT_CREATED, null, null);
    return;
  } catch (error) {
    console.log(error);
    JsonResponse(res, 500, MSG_TYPES.SERVER_ERROR, null, null);
    return;
  }
};


exports.me = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.user.id,
      status: "active",
    }).select("-password -rememberToken");

    if (!user) return JsonResponse(res, 404, MSG_TYPES.NOT_FOUND, null, null);

    JsonResponse(res, 200, MSG_TYPES.FETCHED, user, null);
    return;
  } catch (error) {
    console.log(error);
    JsonResponse(res, 500, MSG_TYPES.SERVER_ERROR, null, null);
    return;
  }
};

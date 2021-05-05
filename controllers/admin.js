const fs = require("fs");
const path = require("path");
const moment = require("moment");
const Template = require("../templates");
const { Admin, validateAdmin } = require("../models/admin");
const { Category, validateCategory } = require("../models/category");
const { JsonResponse } = require("../lib/apiResponse");
const { MSG_TYPES, ACCOUNT_TYPES } = require("../constant/msg");
const { UploadFileFromBinary, Mailer, GenerateToken } = require("../utils");
const bcrypt = require("bcrypt");

/**
 * Create Admin
 * @param {*} req
 * @param {*} res
 */
exports.create = async (req, res) => {
  try {
    const { error } = validateAdmin(req.body);
    if (error)
      return JsonResponse(res, 400, error.details[0].message, null, null);

    // check if an existing admin has incoming email
    const adminCheck = await Admin.findOne({ email: req.body.email });
    if (adminCheck) {
      JsonResponse(res, 400, `\"email or phoneNumber "\ already exists!`);
      return;
    }

    const token = GenerateToken(225);
    req.body.rememberToken = {
      token,
      expiredDate: moment().add(2, "days"),
    };
    // req.body.createdBy = req.user.id;
    req.body.password = await bcrypt.hash(req.body.password, 10);
    await Admin.create(req.body);

    const subject = "Account Verification Code";
    const html = Template.Verification(token, req.body.email, "admin");
    await Mailer(req.body.email, subject, html);

    JsonResponse(res, 201, MSG_TYPES.ACCOUNT_CREATED, null, null);
    return;
  } catch (error) {
    console.log(error);
    return res.status(500).send("Something went wrong!");
  }
};

/**
 * Create category
 * @param {*} req
 * @param {*} res
 */
exports.category = async (req, res) => {
  try {
    const { error } = validateCategory(req.body);
    if (error)
      return JsonResponse(res, 400, error.details[0].message, null, null);

    await Category.create(req.body);

    JsonResponse(res, 201, MSG_TYPES.CREATED, null, null);
    return;
  } catch (error) {
    console.log(error);
    return res.status(500).send("Something went wrong!");
  }
};


/**
 * get all state
 * @param {*} req
 * @param {*} res
 */
exports.state = async (req, res) => {
  try {
    const dir = path.join(__dirname + "../../constant/states.json");
    const obj = JSON.parse(fs.readFileSync(dir, "utf8"));

    JsonResponse(res, 200, MSG_TYPES.FETCHED, obj, null);
    return;
  } catch (err) {
    console.log(err);
    JsonResponse(res, 500, MSG_TYPES.SERVER_ERROR, null, null);
  }
};

const { Organizer, validateOrganizer } = require("../../models/organizer");
const config = require("config");
const moment = require("moment");
const { JsonResponse } = require("../../lib/apiResponse");
const { MSG_TYPES } = require("../../constant/msg");
const bcrypt = require("bcrypt");
const { Mailer, GenerateToken } = require("../../utils");
const SendOTPCode = require("../../templates")


exports.organizer = async (req, res) => {
  try {
    // validate request
    const { error } = validateOrganizer(req.body);
    if (error)
      return JsonResponse(res, 400, error.details[0].message, null, null);

    // check if account exist
    const organizerExist = await Organizer.findOne({ email: req.body.email });
    if (organizerExist)
      return JsonResponse(res, 400, MSG_TYPES.ACCOUNT_EXIST, null, null);

    // create new account record
    const token = GenerateToken(225);
    req.body.rememberToken = { token, expiredDate: moment().add(2, "days") };
    const newOrganizer = new Organizer(req.body);
    newOrganizer.password = await bcrypt.hash(newOrganizer.password, 10);
    newOrganizer.email.toLowerCase();
    await newOrganizer.save();

    const subject = "Account Verification Code";
    const html = SendOTPCode.Verification(
      token,
      newOrganizer.email,
      "organizer"
    );
    await Mailer(newOrganizer.email, subject, html);

    JsonResponse(res, 200, MSG_TYPES.ACCOUNT_CREATED, null, null);
    return;
  } catch (error) {
    console.log(error);
    JsonResponse(res, 500, MSG_TYPES.SERVER_ERROR, null, null);
    return;
  }
};


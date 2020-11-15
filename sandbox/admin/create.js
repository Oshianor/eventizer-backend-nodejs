const {
  Admin,
  validateAdmin,
} = require("../../models/admin");
const { Category, validateCategory } = require("../../models/category")
const { JsonResponse } = require("../../lib/apiResponse");
const { MSG_TYPES, ACCOUNT_TYPES } = require("../../constant/msg");
const { UploadFileFromBinary, Mailer, GenerateToken } = require("../../utils");
const Template = require("../../templates");
const moment = require("moment");

/**
 * Create Admin
 * @param {*} req
 * @param {*} res
 */
exports.admin = async (req, res) => {
  try {
    const { error } = validateAdmin(req.body);
    if (error)
      return JsonResponse(res, 400, error.details[0].message, null, null);

    // check if an existing admin has incoming email
    const adminCheck = await Admin.findOne({ email: req.body.email });
    if (adminCheck) {
      JsonResponse(res, 400, `\"email or phoneNumber "\ already exists!`, null, null);
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

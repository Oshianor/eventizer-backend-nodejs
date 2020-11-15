const Joi = require("joi");
const { Admin } = require("../../models/admin");
const { JsonResponse } = require("../../lib/apiResponse");
const { MSG_TYPES } = require("../../constant/msg");
const fs = require("fs")
const path = require("path")

/**
 * get all state
 * @param {*} req
 * @param {*} res
 */
exports.state = async (req, res) => {
  try {
    const dir = path.join(__dirname + "../../../constant/states.json");
    const obj = JSON.parse(fs.readFileSync(dir, "utf8"));

    JsonResponse(res, 200, MSG_TYPES.FETCHED, obj, null);
    return;
  } catch (err) {
    console.log(err);
    JsonResponse(res, 500, MSG_TYPES.SERVER_ERROR, null, null);
  }
};



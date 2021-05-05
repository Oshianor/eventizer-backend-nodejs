const jwt = require("jsonwebtoken");
const { JsonResponse } = require("../lib/apiResponse");
const config = require("config");
const { MSG_TYPES } = require("../constant/msg");


// auth middleware
const Auth = async (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token)
    return JsonResponse(res, 401, MSG_TYPES.ACCESS_DENIED, null, null);

  try {
    const decoded = jwt.verify(token, config.get("application.jwt.key"));

    console.log("decoded", decoded);
    req.user = decoded;
    next();
  } catch (ex) {
    console.log(ex);
    if (ex.msg) {
      return JsonResponse(res, 401, ex.msg);
    }
    res.status(406).send();
  }
};

module.exports = {
  Auth
};

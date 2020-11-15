const { User } = require("../../models/users");
const { Admin } = require("../../models/admin");
const { Organizer, validateVerifyAccount } = require("../../models/organizer");
const config = require("config");
const { JsonResponse } = require("../../lib/apiResponse");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { MSG_TYPES } = require("../../constant/msg");


exports.account = async (req, res) => {
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
      if (!admin) return JsonResponse(res, 404, MSG_TYPES.NOT_FOUND, null, null);
      await admin.updateOne(dataUpdate);
    }

    JsonResponse(res, null, MSG_TYPES.ACCOUNT_VERIFIED, null, null);
    return
  } catch (error) {
    console.log(error);
    return res.status(400).send("Something went wrong");
  }
};


// ResendMemberOTP = async (req, res) => {
//   try {
//     // find the church by the public token
//     const user = await User.findOne({
//       publicToken: req.publicToken,
//       verified: true,
//     });

//     if (!user) return res.status(400).send("No church found");

//     const currentDate = new Date();
//     // check if bank has already been created with the exalt name for the branch
//     const member = await Member.findOne({
//       email: req.body.email,
//       verified: false,
//       userId: user._id,
//     });

//     if (!member) return res.status(400).send("Please try again in 10mins");

//     if (new Date(member.otpExpiredDate) > currentDate)
//       return res.status(400).send("Please try again in 10mins");

//     const otpCode = GenerateOTP(4);
//     const otpExpiredDate = moment().add(10, "minute");
//     await member.updateOne({ otpExpiredDate, otpCode });

//     const body = `Welcome to ${user.name} App. Your OTP to perform this request is ${otpCode}. This code expires in 10mins`;
//     const to = `${member.countryCode}${member.phoneNumber}`;
//     sendOTP(body, to);

//     const subject = "Account Verification Code";
//     const html = OtpTemplate(otpCode);
//     Mailer(member.email, subject, html);

//     return res.send(`OTP sent..`);
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send("Something went wrong!");
//   }
// };
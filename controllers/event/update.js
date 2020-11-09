


// exports.VerfiyMemberAccount = async (req, res) => {
//   try {
//     const { error } = validateOTP(req.body);

//     if (error) return res.status(400).send(error.details[0].message);

//     // find the root account for church
//     const user = await User.findOne({
//       publicToken: req.publicToken,
//       verified: true,
//     });

//     if (!user) return res.status(400).send("No account found.");

//     const currentDate = new Date();

//     const member = await Member.findOne({
//       verified: false,
//       email: req.body.email,
//       otpCode: req.body.otpCode,
//       userId: user._id,
//       otpExpiredDate: { $gte: currentDate },
//     });

//     if (!member) return res.status(404).send("Your session has expired.");

//     // check if the church is the same with church assign to the member
//     if (String(user._id) !== String(member.userId))
//       return res.status(400).send("You don't have access to this church");

//     await member.updateOne({
//       otpCode: null,
//       verified: true,
//       otpExpiredDate: null,
//       phoneNumberVerified: true,
//     });

//     const token = member.generateToken(true, null);

//     return res.header("x-auth-token", token).send("Account verified.");
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send("Something went wrong");
//   }
// };
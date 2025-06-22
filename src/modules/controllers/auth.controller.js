const UserModel = require("../model/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../../../config");
const otpGenerator = require("otp-generator");
const { getAllUsersService } = require("../services/auth.service");
const pick = require("../middleware/pick");
const { sendMailWithGmail } = require("../middleware/sendEmail");

// const verifyUser = async (req, res, next) => {
//     try {

//         const { username } = req.method == "GET" ? req.query : req.body;

//         // check the user existance
//         let exist = await UserModel.findOne({ username });
//         if (!exist) return res.status(404).send({ error: "Can't find User!" });
//         next();

//     } catch (error) {
//         return res.status(404).send({ error: "Authentication Error" });
//     }
// }

const verifyUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader, "authHeader manageSeller");
  if (!authHeader) {
    return res.status(401).send({ message: "UnAuthorized access" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, config.jwt_secret, function (err, decoded) {
    if (err) {
      return res.status(403).send({ message: "Forbidden access" });
    }
    // Check the user's role in the decoded JWT payload
    const userRole = decoded.role;

    if (userRole === "seller") {
      req.decoded = decoded;
      next(); // User with 'seller' role is allowed
    } else {
      return res.status(403).send({ message: "Forbidden access" });
    }
  });
};

// NOTE: make sure you use verifyAdmin after verifyJWT
// const verifyAdmin = async (req, res, next) => {
//     const decodedEmail = req.decoded.email;
//     const query = { email: decodedEmail };
//     const user = await UserModel.findOne(query);

//     if (user?.role !== 'admin') {
//         return res.status(403).send({ message: 'forbidden access' })
//     }
//     next();
// }
const verifyAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "Unauthorized access" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, config.jwt_secret, function (err, decoded) {
    if (err) {
      return res.status(403).send({ message: "Forbidden access" });
    }

    // Check the user's role in the decoded JWT payload
    const userRole = decoded.role;

    if (userRole === "admin") {
      req.decoded = decoded;
      next(); // User with 'admin' role is allowed
    } else {
      return res.status(403).send({ message: "Forbidden access" });
    }
  });
};

const verifySeller = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "Unauthorized access" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, config.jwt_secret, function (err, decoded) {
    if (err) {
      return res.status(403).send({ message: "Forbidden access" });
    }

    // Check the user's role in the decoded JWT payload
    const userRole = decoded.role;

    if (userRole === "seller") {
      req.decoded = decoded;
      next(); // User with 'seller' role is allowed
    } else {
      return res.status(403).send({ message: "Forbidden access" });
    }
  });
};

// const register = async (req, res, next) => {

//     // export async function register(req, res) {

//     try {
//         const { username, password, email, profile, } = req.body

//         // Check  the existing user
//         const existUsername = new Promise((resolve, reject) => {
//             UserModel.findOne({ username }, function (err, user) {
//                 if (err) reject(new Error(err))
//                 if (user) reject({ error: "Please use unique username" })
//                 resolve()
//             })
//         })

//         // Check for existing email
//         const existEmail = new Promise((resolve, reject) => {
//             UserModel.findOne({ email }, function (err, email) {
//                 if (err) reject(new Error(err))
//                 if (email) reject({ error: "Please use unique email" })
//                 resolve()
//             })
//         })

//         Promise.all([existUsername, existEmail])
//             .then(() => {
//                 if (password) {
//                     bcrypt.hash(password, 10)
//                         .then(hashedPassword => {

//                             const user = new UserModel({
//                                 username,
//                                 password: hashedPassword,
//                                 profile: profile || '',
//                                 email,

//                             })
//                             // return save result as a response
//                             user.save()
//                                 .then(result => res.status(201).send({ msg: "User register successfully" }))
//                                 .catch(error => res.status(500).send({ error }))
//                         }).catch(error => {
//                             return res.status(500).send({
//                                 error: "Enabled to hash password"
//                             })
//                         })
//                 }
//             }).catch(error => {
//                 return res.status(500).send({ error })
//             })

//     } catch (error) {
//         return res.status(500).send(error)
//     }
// }
const register = async (req, res, next) => {
  try {
    const { username, password, email, profile, gender, mobile } = req.body;
    const data = req.body;
    // const existingUser = await UserModel.findOne({ username });
    // if (existingUser) {
    //   return res.status(400).send({ error: "Please use a unique username" });
    // }

    const existingEmail = await UserModel.findOne({ email });
    if (existingEmail) {
      return res.status(400).send({ error: "Please use a unique email" });
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await UserModel.create({
        username,
        email,
        password: hashedPassword,
        profile: profile || "",
        // gender: gender || "",
        // mobile: mobile || ""
      });
      console.log(user, 'userrrrrrr')
      try {
        const token = user.generateConfirmationToken();
        await user.save({ validateBeforeSave: false });

        const mailData = {
          to: email,
          subject: "Verify your Account",
          text: `<div style="font-family: 'Arial', sans-serif; padding: 20px; background-color: #f4f4f4;">
              <div style="max-width: 600px;  background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                <h2 style="color: #333333;">Email Verification</h2>
                <p style="color: #666666;">Dear user,</p>
                <p style="color: #666666;">Thank you for signing up on commerce! To complete your registration, please click the link below to verify your email address:</p>
                <p style="color: #666666; margin-bottom: 20px;"><a href="http://localhost:5000/api/v1/register/confirmation/${token}" style="color: #007BFF; text-decoration: none;">Verify Email Address</a></p>
                <p style="color: #666666;">If you didn't sign up for our service, you can ignore this email.</p>
              </div>
              <p style="color: #999999; margin-top: 20px;">This email was sent by Commerce.</p>
            </div>`,
        };

        await sendMailWithGmail(mailData);

        return res.status(201).json({
          status: "Success",
          message: "Registration successful. Please verify your email.",
        });
      } catch (error) {
        return res.status(500).json({
          status: "Fail",
          message: "Couldn't register Successfully",
          error: error.message,
        });
      }
    }
  } catch (error) {
    return res.status(500).send(error);
  }
};

const sellerRegistration = async (req, res, next) => {
  try {
    const { username, password, email, profile, gender, mobile } = req.body;

    const existingEmail = await UserModel.findOne({ email });
    if (existingEmail) {
      return res.status(400).send({ error: "Please use a unique email" });
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await UserModel.create({
        username,
        email,
        seller: false,
        password: hashedPassword,
        profile: profile || "",
        gender,
        mobile,
      });
      try {
        const token = user.generateConfirmationToken();
        await user.save({ validateBeforeSave: false });

        const mailData = {
          to: email,
          subject: "Verify your Account",
          text: `<div style="font-family: 'Arial', sans-serif; padding: 20px; background-color: #f4f4f4;">
              <div style="max-width: 600px;  background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                <h2 style="color: #333333;">Email Verification</h2>
                <p style="color: #666666;">Dear user,</p>
                <p style="color: #666666;">Thank you for signing up on commerce! To complete your registration, please click the link below to verify your email address:</p>
                <p style="color: #666666; margin-bottom: 20px;"><a href="http://localhost:5000/api/v1/register/confirmation/${token}" style="color: #007BFF; text-decoration: none;">Verify Email Address</a></p>
                <p style="color: #666666;">If you didn't sign up for our service, you can ignore this email.</p>
              </div>
              <p style="color: #999999; margin-top: 20px;">This email was sent by Commerce.</p>
            </div>`,
        };

        await sendMailWithGmail(mailData);

        return res.status(201).json({
          status: "Success",
          message: "Registration successful. Please verify your email.",
        });
      } catch (error) {
        return res.status(500).json({
          status: "Fail",
          message: "Couldn't register Successfully",
          error: error.message,
        });
      }
    }
  } catch (error) {
    return res.status(500).send(error);
  }
};

// const login = async (req, res, next) => {
//     const { username, password } = req.body
//     try {
//         UserModel.findOne({ username })
//             .then(user => {
//                 console.log("User found:", user);

//                 bcrypt.compare(password, user.password)
//                     .then(passwordCheck => {

//                         if (!passwordCheck) return res.status(400).send({ error: "Don't have password" })

//                         // Create jwt token
//                         const token = jwt.sign({
//                             userId: user._id,
//                             username: user.username
//                         }, config.jwt_secret, { expiresIn: "24h" })
//                         return res.status(200).send({
//                             mgs: "Login successful...!",
//                             username: user.username,
//                             token
//                         })

//                     })
//                     .catch(error => {
//                         return res.status(404).send({ error: "Password doesn't match" })
//                     })
//             })
//             .catch(error => {
//                 return res.status(404).send({ error: "Username not found" })
//             })

//     } catch (error) {
//         return res.status(500).send(error)
//     }
// }

const login = async (req, res, next) => {
  console.log(req.body, "data login");
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).send({ error: "Email not found" });
    }
    if (user.role === "unauthorized") {
      return res.status(404).send({ error: "Please verify your mail" });
    }
    if (user.role === "unauthorizedSeller") {
      return res.status(404).send({ error: "Please wait for admin approval" });
    }

    const passwordCheck = await bcrypt.compare(password, user.password);

    if (!passwordCheck) {
      return res.status(400).send({ error: "Password doesn't match" });
    }

    const token = jwt.sign(
      {
        email: user.email,
        role: user.role,
      },
      config.jwt_secret,
      { expiresIn: "24h" }
    );

    return res.status(200).send({
      mgs: "Login successful...!",
      email: user.email,
      token,
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};

const getUser = async (req, res, next) => {
  const { email } = req.params;
  console.log(email, "user email");
  try {
    if (!email) return res.status(501).send({ error: "Invalid Email" });

    UserModel.findOne({ email }, function (err, user) {
      if (err) return res.status(500).send({ err });
      if (!user)
        return res.status(501).send({ error: "Couldn't Find the User" });

      /** remove password from user */
      // mongoose return unnecessary data with object so convert it into json
      const { password, ...rest } = Object.assign({}, user.toJSON());

      return res.status(201).send(rest);
    });
  } catch (error) {
    return res.status(404).send({ error: "Cannot Find User Data" });
  }
};

const confirmEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await UserModel.findOne({ confirmationToken: token });

    if (!user) {
      return res.status(403).json({
        status: "fail",
        error: "Invalid token",
      });
    }

    const expired = new Date() > new Date(user.confirmationTokenExpires);

    if (expired) {
      return res.status(401).json({
        status: "fail",
        error: "Token expired",
      });
    }

    user.role = "buyer";
    user.confirmationToken = undefined;
    user.confirmationTokenExpires = undefined;

    user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: "success",
      message: "Successfully activated your account.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "fail",
      error,
    });
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const paginationOptions = pick(req.query, [
      "page",
      "limit",
      "sortBy",
      "sortOrder",
    ]);

    const filters = pick(req.query, ["searchTerm"]);

    const users = await getAllUsersService(filters, paginationOptions);
    res.status(200).json({
      status: "Success",
      message: "Users find Successfully",
      meta: users.meta,
      data: users.data,
    });
  } catch (error) {
    res.status(400).json({
      status: "Fail",
      message: "Users couldn't found Successfully",
      error: error.message,
    });
  }
};

async function updateUser(req, res) {
  try {
    // const id = req.query.id;
    const { userEmail } = req.params;
    console.log(userEmail, req.body);
    if (userEmail) {
      const data = req.body;

      const filter = { email: userEmail };
      const updateDoc = {
        $set: data,
      };
      const result = await UserModel.updateOne(filter, updateDoc, {
        runValidators: true,
      });
      console.log(result, "resultttttttttttt");
      res.status(200).json({
        status: "Success",
        message: "Update profile Successfully",
        data: result,
      });
    } else {
      return res.status(401).send({ error: "User Not Found...!" });
    }
  } catch (error) {
    return res.status(401).send({ error });
  }
}

const generateOTP = async (req, res) => {
  req.app.locals.OTP = await otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  res.status(201).send({ code: req.app.locals.OTP });
};

const verifyOTP = async (req, res) => {
  const { code } = req.query;
  if (parseInt(req.app.locals.OTP) == parseInt(code)) {
    req.app.locals.OTP = null; //reset the OTP value
    req.app.locals.resetSession = true; // start session for reset password
    return res.status(201).send({ msg: "Verify Successsfully!" });
  }
  return res.status(400).send({ error: "Invalid OTP" });
};

const crateResetSession = async (req, res) => {
  if (req.app.locals.resetSession) {
    return res.status(201).send({ flag: req.app.locals.resetSession });
  }
  return res.status(440).send({ error: "Session expired!" });
};

const resetPassword = async (req, res) => {
  try {
    if (!req.app.locals.resetSession)
      return res.status(440).send({ error: "Session expired!" });

    const { username, password } = req.body;
    try {
      UserModel.find({ username })
        .then((user) => {
          bcrypt
            .hash(password, 10)
            .then((hashedPassword) => {
              UserModel.updateOne(
                { username: user.username },
                { password: hashedPassword },
                function (err, data) {
                  if (err) throw err;
                  req.app.locals.resetSession = false; // reset session
                  return res.status(201).send({ msg: "Record Updated...!" });
                }
              );
            })
            .catch((error) => {
              return res
                .status(500)
                .send({ error: "Enable to hashed password" });
            });
        })
        .catch((error) => {
          return res.status(404).send({ error: "Username not found" });
        });
    } catch (error) {
      return res.status(500).send({ error });
    }
  } catch (error) {
    return res.status(401).send({ error });
  }
};

module.exports.authController = {
  verifyUser,
  verifyAdmin,
  verifySeller,
  register,
  sellerRegistration,
  login,
  confirmEmail,
  getUser,
  getAllUsers,
  updateUser,
  generateOTP,
  verifyOTP,
  crateResetSession,
  resetPassword,
};

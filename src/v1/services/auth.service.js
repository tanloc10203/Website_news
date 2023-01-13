const ParentService = require("./parent.service");
const { validateEmail, sendEmailVerifyAccount } = require("./email.service");
const OtpGenerator = require("otp-generator");
const { _Token } = require("../models/token.model");
const { URI_SERVER } = process.env;

class AuthService extends ParentService {
  signUp = ({ email, password }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const checkEmail = await validateEmail(email);

        if (checkEmail.errors) {
          return resolve(checkEmail);
        }

        const findEmail = await this.model
          .findOne({
            email: email,
          })
          .exec();

        if (findEmail) {
          return resolve({
            errors: {
              message: "Email đã tồn tại !",
            },
            status: 400,
          });
        }

        const hashPassword = await this.model.hashPassword(password);

        const response = await this.create({ email, password: hashPassword });

        // create token and save token
        const OTP = OtpGenerator.generate(6, {
          digits: true,
          lowerCaseAlphabets: false,
          upperCaseAlphabets: false,
          specialChars: false,
        });

        const hashOTP = await _Token.hashToken(OTP);

        await _Token.create({
          user_id: response.elements._id,
          token: hashOTP,
        });

        const URL_REDIRECT = `${URI_SERVER}api/v1/auth/verify/${email}?token=${hashOTP}`;

        const dataSend = {
          data: response.elements,
          sendToEmail: email,
          urlVerify: URL_REDIRECT,
        };

        const sendEmailResponse = await sendEmailVerifyAccount(dataSend);

        resolve(sendEmailResponse);
      } catch (error) {
        reject(error);
      }
    });
  };

  signIn = async ({}) => {};

  verifyAccount = ({ email, otp }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const findOtp = await _Token.findOne({ token: otp }).exec();

        if (!findOtp) {
          return resolve({
            errors: {
              message:
                "Xác thực của bạn đã hết hạn. Vui lòng click vào gửi lại xác thực",
            },
            status: 400,
          });
        }

        const findUser = await this.model
          .findOne({
            email: email,
            _id: findOtp.user_id,
          })
          .exec();

        if (!findUser) {
          return resolve({
            errors: {
              message:
                "Chúng tôi không thể tìm thấy người dùng cho xác minh này. Vui lòng Đăng ký!",
            },
            status: 400,
          });
        }

        if (findUser.is_verified) {
          return resolve({
            status: 200,
            elements: {
              message: "Xác thực tài khoản thành công",
            },
            errors: null,
          });
        }

        findUser.is_verified = true;

        await findUser.save();

        await findOtp.delete();

        resolve({
          status: 200,
          elements: {
            message: "Xác thực tài khoản thành công",
          },
          errors: null,
        });
      } catch (error) {
        reject(error);
      }
    });
  };
}

module.exports = AuthService;
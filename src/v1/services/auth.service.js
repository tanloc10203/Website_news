const ParentService = require("./parent.service");
const { validateEmail, sendEmailVerifyAccount } = require("./email.service");
const { _Token } = require("../models/token.model");
const { URI_SERVER } = process.env;
const { jwtService } = require("./jwt.service");
const TokenService = require("./token.service");
const {
  handleHtmlLang,
  handleHtmlLangEmailForgotPassword,
} = require("../utils/functions");

const PRIVATE_KEY_ACCESS_TOKEN = process.env.PRIVATE_KEY_ACCESS_TOKEN;
const PRIVATE_KEY_REFRESH_TOKEN = process.env.PRIVATE_KEY_REFRESH_TOKEN;

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
        const { token } = await TokenService.create({
          user_id: response.elements._id,
        });

        const URL_REDIRECT = `${URI_SERVER}api/v1/auth/verify/${email}?token=${token}`;

        const dataSend = {
          data: response.elements,
          sendToEmail: email,
          urlVerify: URL_REDIRECT,
        };

        const options = {
          subject: "Xác thực tài khoản",
          handleHtmlLang: handleHtmlLang(dataSend),
        };

        const sendEmailResponse = await sendEmailVerifyAccount(
          dataSend,
          options
        );

        resolve(sendEmailResponse);
      } catch (error) {
        reject(error);
      }
    });
  };

  signIn = async ({ email, password }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const findEmail = await this.model
          .findOne({ email, is_delete: false })
          .select("email password is_verified role full_name image")
          .exec();

        if (!findEmail) {
          return resolve({
            errors: {
              message: "Email không tồn tại",
            },
            status: 400,
          });
        }

        if (!findEmail.is_verified) {
          return resolve({
            errors: {
              message:
                "Tài khoản của bạn chưa xác thực vui lòng kiểm tra email",
            },
            status: 400,
          });
        }

        const comparePassword = await this.model.comparePassword(
          password,
          findEmail.password
        );

        if (!comparePassword) {
          return resolve({
            errors: {
              message: "Mật khẩu không chính xác !",
            },
            status: 400,
          });
        }

        const { password: oldPassword, ...others } = findEmail._doc;

        const accessToken = jwtService.sign(
          { user: others },
          PRIVATE_KEY_ACCESS_TOKEN,
          {
            expiresIn: "15m",
          }
        );

        const refreshToken = jwtService.sign(
          { user: others },
          PRIVATE_KEY_REFRESH_TOKEN,
          {
            expiresIn: "1w",
          }
        );

        resolve({
          errors: null,
          elements: {
            accessToken,
            refreshToken,
          },
          status: 200,
          meta: {
            message: "Đăng nhập thành công",
          },
        });
      } catch (error) {
        reject(error);
      }
    });
  };

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
            is_delete: false,
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

  forgotPassword = ({ email }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const findEmail = await this.model
          .findOne({ email, is_delete: false })
          .select("_id")
          .exec();

        if (!findEmail) {
          return resolve({
            errors: {
              message: "Email không tồn tại trong hệ thống!",
            },
            status: 400,
          });
        }

        const { token } = await TokenService.create({ user_id: findEmail._id });

        const URL_REDIRECT = `${process.env.URI_SERVER}/api/v1/auth/forgot-password/${email}?token=${token}`;

        const dataSend = {
          data: {},
          sendToEmail: email,
          urlVerify: URL_REDIRECT,
        };

        const options = {
          subject: "Quên mật khẩu",
          handleHtmlLang: handleHtmlLangEmailForgotPassword(dataSend),
        };

        const sendEmailResponse = await sendEmailVerifyAccount(
          dataSend,
          options
        );

        resolve(sendEmailResponse);
      } catch (error) {
        reject(error);
      }
    });
  };

  changePassword = ({ email, token, password }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const findOtp = await _Token.findOne({ token }).exec();

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
            is_delete: false,
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

        if (!findUser.is_verified) {
          return resolve({
            status: 200,
            elements: {
              message: "Tài khoản của bạn chưa được xác thực",
            },
            errors: null,
          });
        }

        findUser.password = await this.model.hashPassword(password);

        await findUser.save();

        resolve({
          elements: findUser,
          status: 200,
          errors: null,
          meta: {
            message: "Thay đổi mật khẩu thành công.",
          },
        });
      } catch (error) {
        reject(error);
      }
    });
  };
}

module.exports = AuthService;

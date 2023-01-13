const { validate } = require("deep-email-validator");
const nodemailer = require("nodemailer");
const { handleHtmlLang } = require("../utils/functions");

function validateEmail(email) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await validate(email);

      const { valid, reason, validators } = response;

      if (!valid && reason && !validators[reason].valid) {
        return resolve({
          errors: {
            message: "Vui lòng cung cấp một địa chỉ email hợp lệ",
          },
          status: 400,
        });
      }

      resolve({
        errors: null,
      });
    } catch (error) {
      reject(error);
    }
  });
}

async function sendEmailVerifyAccount(dataSend) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP_USERNAME, // generated ethereal user
      pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
    },
  });

  try {
    // send mail with defined transport object
    const response = await transporter.sendMail({
      from: `"Website tin tức 👻" <${process.env.EMAIL_APP_USERNAME}>`, // sender address
      to: dataSend.sendToEmail, // list of receivers
      subject: "Xác thực tài khoản", // Subject line
      html: handleHtmlLang(dataSend),
    });

    if (response) {
      return {
        status: 201,
        errors: null,
        elements: dataSend.data,
      };
    }
  } catch (error) {
    return {
      status: 500,
      errors: error,
      elements: null,
    };
  }
}

module.exports = {
  validateEmail,
  sendEmailVerifyAccount,
};

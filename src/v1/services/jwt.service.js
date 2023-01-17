const jwt = require("jsonwebtoken");

module.exports.jwtService = {
  sign: (object, privateKey, options) => {
    return jwt.sign(object, privateKey, { ...(options && options) });
  },

  verify: (token, privateKey) => {
    try {
      const decoded = jwt.verify(token, privateKey);
      return {
        valid: true,
        expired: false,
        decoded,
      };
    } catch (e) {
      console.error(e);
      return {
        valid: false,
        expired: e.message === "jwt expired",
        decoded: null,
      };
    }
  },
};

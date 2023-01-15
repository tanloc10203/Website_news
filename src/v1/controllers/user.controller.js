const { _User } = require("../models/user.model");
const UserService = require("../services/user.service");
const { typeOfObjectId } = require("../utils/functions");
const ParentController = require("./parent.controller");

class UserController extends ParentController {
  constructor() {
    const service = new UserService(_User);
    super(service);
  }

  create = async (req, res, next) => {
    try {
      const data = req.body;

      if (!data.email || !data.password) {
        return next({
          status: 400,
          message: "Thiếu trường email hoặc password",
        });
      }

      const response = await this.service.create({
        email: data.email,
        password: data.password,
      });

      res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req, res, next) => {
    try {
      let { limit, page, search, search_name, sort } = req.query;
      const selectField = "role is_verified email full_name image";

      let response;

      if (!limit && !page) {
        response = await this.service.getAll({
          selectField,
        });
      } else if (search && search_name) {
        response = await this.service.getAll({
          search,
          search_name,
          limit: +limit,
          page: +page,
          selectField,
        });
      } else if (search) {
        response = await this.service.getAll({
          search,
          limit: +limit,
          page: +page,
          selectField,
        });
      } else if (sort) {
        response = await this.service.getAll({
          limit: +limit,
          page: +page,
          selectField,
          sort,
        });
      }

      res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (req, res, next) => {
    try {
      const id = req.params.id;
      const password = req.body.password;

      if (!typeOfObjectId(id + "")) {
        return next({
          status: 400,
          message: "Id không hợp lệ",
        });
      }

      if (!password) {
        return next({
          status: 400,
          message: "Thiếu trường mật khẩu !",
        });
      }

      const response = await this.service.changePassword({ id, password });
      res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new UserController();

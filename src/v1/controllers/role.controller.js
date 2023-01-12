const RoleService = require("../services/role.service");
const { _Role } = require("../models/role.model");
const ParentController = require("./parent.controller");

class RoleController extends ParentController {
  #_service;

  constructor() {
    const _service = new RoleService(_Role);
    super(_service);
    this.#_service = _service;
  }

  getRoleIdGTE5 = async (req, res, next) => {
    try {
      const response = await this.#_service.getRoleIdGTE5();
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  // @override
  create = async (req, res, next) => {
    try {
      const data = req.body;

      if (!data.name || !data.key) {
        return next({
          status: 400,
          message: "Thiếu trường name hoặc key",
        });
      }

      const response = await this.#_service.create(data);
      res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new RoleController();

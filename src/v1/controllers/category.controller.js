const ParentController = require("./parent.controller");
const { _Category } = require("../models/category.model");
const CategoryService = require("../services/category.service");

class CategoryController extends ParentController {
  constructor() {
    const _service = new CategoryService(_Category);
    super(_service);
  }

  create = async (req, res, next) => {
    try {
      const data = req.body;

      console.log("check data:::", data);

      if (!data.name || !data.slug) {
        return next({
          message: "Tên danh mục hoặc slug là trường bắt buộc !",
          status: 400,
        });
      }

      const response = await this.service.create(data);
      res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new CategoryController();
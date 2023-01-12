class ParentController {
  constructor(service) {
    this.service = service;
  }

  getAll = async (req, res, next) => {
    try {
      const response = await this.service.getAll();
      res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  };

  create = async (req, res, next) => {
    try {
      const response = await this.service.create(req.body);
      res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  };
  update = async (req, res, next) => {};
}

module.exports = ParentController;

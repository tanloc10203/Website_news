class ParentService {
  constructor(model) {
    this.model = model;
  }

  getAll = async () => {
    return {
      status: 200,
      errors: null,
      elements: {
        data: "",
      },
      meta: {
        pagination: {
          page: 1,
          totalRows: 20,
          limit: 3,
        },
      },
    };
  };

  create = async (data) => {
    const response = await this.model.create(data);

    return {
      elements: response,
      status: 201,
    };
  };

  update = async () => {};

  delete = async () => {};

  getById = async () => {};
}

module.exports = ParentService;

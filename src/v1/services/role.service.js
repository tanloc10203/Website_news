const ParentService = require("./parent.service");

class RoleService extends ParentService {
  superCreate = this.create;

  getRoleIdGTE5 = async () => {
    return {
      status: 200,
      message: "getRoleIdGTE5 success",
    };
  };

  // @override
  create = async (data) => {
    const findKey = await this.model.findOne({
      key: data.key,
    });

    if (findKey) {
      return {
        status: 400,
        errors: {
          message: "Key đã tồn tại",
        },
      };
    }

    const findName = await this.model.findOne({
      name: data.name,
    });

    if (findName) {
      return {
        status: 400,
        errors: {
          message: "Name đã tồn tại",
        },
      };
    }

    const response = await this.superCreate(data);

    return response;
  };
}

module.exports = RoleService;

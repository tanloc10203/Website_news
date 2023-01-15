const { typeOfObjectId } = require("../utils/functions");

class ParentService {
  constructor(model) {
    this.model = model;
  }

  getAll = (filters = {}) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { limit, page, selectField, search, search_name, populate } =
          filters;

        if (search_name && search) {
          return resolve(
            await this.getAllAndFilterWithSearchCharector({
              limit,
              page,
              selectField,
              search,
              search_name,
            })
          );
        }

        if (search) {
          return resolve(
            await this.getAllAndFilerWithSearchFullText({
              limit,
              page,
              selectField,
              search,
            })
          );
        }

        if (!limit && !page) {
          return resolve({
            elements: await this.getAllNotParams(selectField),
            errors: null,
            status: 200,
          });
        }

        if (!populate) {
          return resolve(
            await this.getAllWithoutPopulate({ limit, page, selectField })
          );
        }

        resolve(
          await this.getAllWithPopulate({ limit, page, selectField, populate })
        );
      } catch (error) {
        reject(error);
      }
    });
  };

  create = async (data) => {
    const response = await this.model.create(data);

    return {
      elements: response,
      status: 201,
      errors: null,
    };
  };

  getById = (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!typeOfObjectId(id + "")) {
          return resolve({
            errors: {
              message: "Id không đúng giá trị",
            },
            elements: null,
            status: 400,
          });
        }

        const response = await this.model.findById(id).exec();

        if (!response) {
          resolve({
            errors: {
              message: "Id không tồn tại",
            },
            elements: {},
            status: 200,
          });
        }

        resolve({
          elements: response,
          errors: null,
          status: 200,
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  update = async ({ id, data }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.model.findOneAndUpdate(
          { _id: id },
          { $set: data },
          {
            upsert: false,
            new: true,
          }
        );

        if (!response) {
          return resolve({
            errors: {
              message: "Id không tồn tại",
            },
            status: 400,
          });
        }

        resolve({
          elements: response,
          status: 201,
          errors: null,
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  delete = ({ id, isDelete = false }) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (isDelete) {
          // Xoá vĩnh viễn
          const response = await this.model.findOneAndDelete(
            { _id: id },
            { rawResult: true }
          );

          return resolve({
            errors: null,
            status: 200,
            elements: response,
          });
        }

        const response = await this.update({ id, data: { is_delete: true } });

        resolve(response);
      } catch (error) {
        reject(error);
      }
    });
  };

  deleteForce = async (id) => {
    return await this.delete({ id, isDelete: true });
  };

  /**
   * Lấy dữ liệu không có ref
   * @param {limit, page, selectField} param0
   * @returns
   */
  getAllWithoutPopulate = ({ limit, page, selectField }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const _model = this.model;
        const skip = (page - 1) * limit;

        await _model
          .find({ is_delete: false })
          .select(selectField)
          .limit(limit)
          .skip(skip)
          .exec((error, response) => {
            if (error) {
              reject(error);
            }

            _model.count({ is_delete: false }).exec((error, count) => {
              if (error) {
                reject(error);
              }

              resolve({
                elements: response,
                errors: null,
                status: 200,
                meta: {
                  pagination: {
                    page,
                    limit,
                    totalRows: Math.ceil(count / limit),
                  },
                },
              });
            });
          });
      } catch (error) {
        reject(error);
      }
    });
  };

  /**
   * Lấy dữ liệu có ref
   * @param {limit, page, selecteField, populate} param0
   * @returns
   */
  getAllWithPopulate = ({ limit, page, selectField, populate }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const _model = this.model;
        const skip = (page - 1) * limit;

        await _model
          .find({ is_delete: false })
          .select(selectField)
          .populate(populate)
          .limit(limit)
          .skip(skip)
          .exec((error, response) => {
            if (error) {
              reject(error);
            }

            _model.count({ is_delete: false }).exec((error, count) => {
              if (error) {
                reject(error);
              }

              resolve({
                elements: response,
                errors: null,
                status: 200,
                meta: {
                  pagination: {
                    page,
                    limit,
                    totalRows: Math.ceil(count / limit),
                  },
                },
              });
            });
          });
      } catch (error) {
        reject(error);
      }
    });
  };

  /**
   * Lấy dữ liệu có filter và tìm kiếm bằng full text
   * @param {*} param0
   * @returns
   */
  getAllAndFilerWithSearchFullText = ({ limit, page, selectField, search }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const _model = this.model;
        const skip = (page - 1) * limit;

        await _model
          .find(
            { is_delete: false, $text: { $search: search } },
            { score: { $meta: "textScore" } }
          )
          .sort({ score: { $meta: "textScore" } })
          .select(selectField)
          .limit(limit)
          .skip(skip)
          .exec((error, response) => {
            if (error) {
              reject(error);
            }

            _model
              .count({ is_delete: false, $text: { $search: search } })
              .exec((error, count) => {
                if (error) {
                  reject(error);
                }

                resolve({
                  elements: response,
                  errors: null,
                  status: 200,
                  meta: {
                    pagination: {
                      page,
                      limit,
                      totalRows: Math.ceil(count / limit),
                    },
                  },
                });
              });
          });
      } catch (error) {
        reject(error);
      }
    });
  };

  /**
   * Lấy dữ liệu có filter và tìm kiếm theo trường bằng kí tự
   * @param {*} param0
   * @returns
   */
  getAllAndFilterWithSearchCharector = ({
    limit,
    page,
    selectField,
    search_name,
    search,
  }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const _model = this.model;
        const skip = (page - 1) * limit;

        await _model
          .find({
            is_delete: false,
            [search_name]: { $regex: search, $options: "i" },
          })
          .select(selectField)
          .limit(limit)
          .skip(skip)
          .exec((error, response) => {
            if (error) {
              reject(error);
            }

            _model
              .count({
                is_delete: false,
                [search_name]: { $regex: search, $options: "i" },
              })
              .exec((error, count) => {
                if (error) {
                  reject(error);
                }

                resolve({
                  elements: response,
                  errors: null,
                  status: 200,
                  meta: {
                    pagination: {
                      page,
                      limit,
                      totalRows: Math.ceil(count / limit),
                    },
                  },
                });
              });
          });
      } catch (error) {
        reject(error);
      }
    });
  };

  /**
   * Lấy tất cả dữ liệu
   * @param {*} selectField
   * @returns
   */
  getAllNotParams = async (selectField) => {
    return await this.model.find().select(selectField);
  };
}

module.exports = ParentService;

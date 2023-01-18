const { typeOfObjectId } = require("../utils/functions");
const ParentService = require("./parent.service");

class CategoryService extends ParentService {
  superCreate = this.create;

  create = async (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { name, level, parentId } = data;

        const findName = await this.model.findOne({ name }).exec();

        if (findName) {
          return resolve({
            errors: {
              message: "Tên danh mục đã tồn tại!",
            },
            status: 400,
          });
        }

        if (level && parentId) {
          if (!typeOfObjectId(parentId + "")) {
            return resolve({
              status: 400,
              errors: {
                message: "Parent id không hợp lệ",
              },
              elements: null,
            });
          }

          // * Tìm parent category
          const parentCategory = await this.model
            .findOne({ _id: parentId })
            .select("_id")
            .exec();

          if (!parentCategory) {
            return resolve({
              status: 400,
              errors: {
                message: "Không tìm thấy parent với id",
              },
            });
          }

          // * Tạo children
          const { elements } = await this.superCreate({
            parent_id: parentCategory._id,
            ...data,
          });

          if (elements) {
            const childrenObj = {
              _id: elements._id,
              name: elements.name,
              slug: elements.slug,
            };

            // * Push children => childrens[] of parent
            const parent = await this.model.findOneAndUpdate(
              {
                _id: parentCategory._id,
              },
              {
                $push: { childrens: childrenObj },
              },
              {
                new: true,
                upsert: true,
              }
            );

            return resolve({
              status: 201,
              errors: null,
              elements: {
                children: elements,
                parent: parent,
              },
              meta: {
                message: "Tạo thành công.",
              },
            });
          }
        }

        const response = await this.superCreate({
          parent_id: data.parentId,
          ...data,
        });

        resolve(response);
      } catch (error) {
        reject(error);
      }
    });
  };
}

module.exports = CategoryService;

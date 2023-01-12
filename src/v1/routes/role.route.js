const { Router } = require("express");
const roleController = require("../controllers/role.controller");

const router = Router();

router.get("/", roleController.getAll);
router.get("/get-role-id-gte-5", roleController.getRoleIdGTE5);
router.post("/", roleController.create);

module.exports.roleRoute = router;

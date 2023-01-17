const { Router } = require("express");
const authController = require("../controllers/auth.controller");
const router = Router();

router.get("/verify/:email", authController.verifyAccount);
router.post("/sign-up", authController.signUp);
router.post("/sign-in", authController.signIn);
router.post("/forgot-password", authController.forgotPassword);
router.post("/forgot-password/:email", authController.changePassword);

module.exports.authRoute = router;

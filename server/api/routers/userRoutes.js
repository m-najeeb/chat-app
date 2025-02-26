const { Router } = require("express");
const userController = require("../controllers/userController");
const verifyToken = require("../../src/middleware/verifyToken");

const router = Router();

router.post("/sign-up", userController.signUp);
router.post("/sign-in", userController.signIn);
router.post("/verify-otp", userController.verifyOTP);
router.post("/profile-edit", verifyToken, userController.profileEdit);
router.post("/change-password", verifyToken, userController.changePassword);
router.post("/forget-password", userController.forgetPassword);
router.post("/reset-password", userController.resetPassword);
router.post("/sign-out", verifyToken, userController.signOut);
router.get("/get-users", userController.getUsers);
router.get("/get-users/:id", userController.getUsersById);

module.exports = router;

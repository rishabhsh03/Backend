const express = require("express");
const router = express.Router();

const {
  getUsers,
  saveUsers,
  deleteUser,
  updateUser,
  register,
  ForgotPassword,
  login,
  testMail,
  sendotp
} = require("../controller/user"), require("../controller/user");

router.get("/get-user-data", getUsers);
router.post("/save-user-data", saveUsers);
router.post("/register", register);
router.post("/login", login);
router.delete("/delete-user/:user_id", deleteUser);
router.put("/update-user/:user_id", updateUser);
router.post("/Forgot-password", ForgotPassword);
router.get("/test-mail", testMail);
router.post("/send-otp", sendotp)

module.exports = router;
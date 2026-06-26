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
  sendotp,
  verify,
  saveTodo,
  deleteTodo,
  getTodo,
  updateToDo
} = require("../controller/user");


router.get("/get-user-data", getUsers);
router.post("/save-user-data", saveUsers);
router.post("/register", register);
router.post("/login", login);
router.delete("/delete-user/:user_id", deleteUser);
router.put("/update-user/:user_id", updateUser);
router.post("/Forgot-password", ForgotPassword);
router.get("/test-mail", testMail);
router.post("/send-otp", sendotp);
router.post("/verify-otp", verify);
router.post("/save-to-do", saveTodo);
router.get("/get-to-do", getTodo);
router.delete("/delete-to-do/:todo_id", deleteTodo);
router.put("/update-to-do/:todo_id", updateToDo);
module.exports = router;
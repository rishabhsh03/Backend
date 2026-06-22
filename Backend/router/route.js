const express = require("express");
const router = express.Router();

const {
  getUsers,
  saveUsers,
  deleteUser,
  updateUser,
  register,
  login
} = require("../controller/user");

router.get("/get-user-data", getUsers);
router.post("/save-user-data", saveUsers);
router.post("/register", register);
router.get("/login", login);
router.delete("/delete-user/:user_id", deleteUser);
router.put("/update-user/:user_id", updateUser);

module.exports = router;
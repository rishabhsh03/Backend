const express = require("express");
const router = express.Router();

const {getUser, saveUsers, updateUsers} = require("../controller/user");
// const saveUsers = require("../controller/saveUsers");
// POST 


//  router.post("/save-user-data", saveUsers);
router.get("/get-user-data", getUser);
router.put("/update-user-data", updateUsers);

module.exports = router;
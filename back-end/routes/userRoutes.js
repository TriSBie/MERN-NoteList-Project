const express = require("express");
const router = express.Router();
const userController = require("../controller/userController")

//we can wrap all discrete method from module export into one
router.route("/")
    .get(userController.getAllUser)
    .post(userController.createNewUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)


//always exports router
module.exports = router
const express = require("express");
const router = express.Router();
const loginLimiter = require("../middleware/loginLimiter")
const authController = require("../controller/authController.js")


router.route("/")
    .post(loginLimiter, authController.login)

router.route("/refresh")
    .get(authController.refresh)
// { withCredentials : true}

router.route("/logout")
    .post(authController.logout)

module.exports = router
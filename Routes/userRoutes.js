const express = require('express')
const { register, login, updateProfile, logout } = require('../Controllers/userController')
const isAuthenticated = require('../Middlewares/isAuthenticated')

const router = express.Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").get(logout)
router.route("/profile/update").post(isAuthenticated,updateProfile)

module.exports = router
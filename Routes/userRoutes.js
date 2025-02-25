const express = require('express')
const { register, login, updateProfile, logout, getProfile } = require('../Controllers/userController')
const isAuthenticated = require('../Middlewares/isAuthenticated')
const multer = require('../Middlewares/multer')

const router = express.Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").get(logout)
router.route("/profile/update").put(multer,isAuthenticated,updateProfile)
router.route("/profile").get(isAuthenticated,getProfile)

module.exports = router
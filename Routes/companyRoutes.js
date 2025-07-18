const express = require('express')
const isAuthenticated = require('../Middlewares/isAuthenticated')
const { registerCompany, getCompany, getCompanyById, updateCompany } = require('../Controllers/companyController')
const multer = require('../Middlewares/multer')

const router = express.Router()

router.route("/register").post(multer,isAuthenticated,registerCompany)
router.route("/get").get(isAuthenticated,getCompany)
router.route("/get/:id").get(isAuthenticated,getCompanyById)
router.route("/update/:id").put(multer,isAuthenticated,updateCompany)

module.exports = router
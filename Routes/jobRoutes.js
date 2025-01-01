const express = require('express')
const isAuthenticated = require('../Middlewares/isAuthenticated')
const { postJob, getAllJobs, getJobsByRecruiter, getJobById } = require('../Controllers/jobController')

const router = express.Router()

router.route("/post").post(isAuthenticated, postJob)
router.route("/get").get(isAuthenticated, getAllJobs)
router.route("/getjobsbyrecruiter").get(isAuthenticated, getJobsByRecruiter)
router.route("/get/:id").get(isAuthenticated, getJobById) // check here

module.exports = router
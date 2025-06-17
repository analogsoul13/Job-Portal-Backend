const express = require('express')
const isAuthenticated = require('../Middlewares/isAuthenticated')
const { postJob, getAllJobs, getJobsByRecruiter, getJobById } = require('../Controllers/jobController')

const router = express.Router()

router.route("/").post(isAuthenticated, postJob)
router.route("/").get(isAuthenticated, getAllJobs)
router.route("/recruiter").get(isAuthenticated, getJobsByRecruiter)
router.route("/jobs/:id").get(isAuthenticated, getJobById) // check here

module.exports = router
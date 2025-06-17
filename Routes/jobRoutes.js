const express = require('express')
const isAuthenticated = require('../Middlewares/isAuthenticated')
const { postJob, getAllJobs, getJobsByRecruiter, getJobById, getAllLocations } = require('../Controllers/jobController')

const router = express.Router()

router.route("/").post(isAuthenticated, postJob)
router.route("/").get(isAuthenticated, getAllJobs)
router.route("/recruiter").get(isAuthenticated, getJobsByRecruiter)
router.route("/jobs/:id").get(isAuthenticated, getJobById) // check here
router.route("/locations").get(getAllLocations)

module.exports = router
const express = require('express')
const isAuthenticated = require('../Middlewares/isAuthenticated')
const { applyJob, getAppliedJobs, getApplicants, updateApplicationStatus } = require('../Controllers/applicationController')


const router = express.Router()

router.route("/apply/:id").get(isAuthenticated, applyJob)
router.route("/get").get(isAuthenticated, getAppliedJobs)
router.route("/:id/applicants").get(isAuthenticated, getApplicants)
router.route("/status/:id/update").post(isAuthenticated, updateApplicationStatus)

module.exports = router
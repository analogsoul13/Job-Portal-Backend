const Application = require("../Models/applicationModel")
const Job = require("../Models/jobModel")

const applyJob = async (req, res) => {
    try {
        const userId = req.userId
        const jobId = req.params.id
        if (!jobId) {
            return res.status(400).json({
                message: "Job id is required !",
                success: false
            })
        }

        // Check if the candidate has already applied
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId })
        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job!",
                success: false
            })
        }

        // Check if the job exists
        const job = await Job.findById(jobId)
        if (!job) {
            return res.status(404).json({
                message: "Job not found!",
                success: false
            })
        }

        // Create new application
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId
        })
        job.applications.push(newApplication._id)
        await job.save()
        return res.status(201).json({
            message: "Application submitted successfully!",
            success: true
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Error applying for the job!",
            error,
            success: false
        })

    }
}

// Get all applications for candidate
const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.userId // check again here
        const application = await Application.find({ applicant: userId }).sort({ createdAt: -1 }).populate({
            path: 'job',
            options: { sort: { createdAt: -1 } },
            populate: {                              // Nested populate
                path: 'company',
                options: { sort: { createdAt: -1 } }
            }
        })

        if (application.length === 0) {
            return res.status(404).json({
                message: "No applications found for this candidate!",
                success: false
            })
        }

        return res.status(200).json({
            application,
            success: true
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Error fetching applications for the candidate!",
            error,
            success: false
        })
    }
}

// Get all applications for recruiter
const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id

        const job = await Job.findById(jobId).populate({
            path: 'applications',
            options: { sort: { createdAt: -1 } },
            populate: {                              // Nested populate
                path: 'applicant'
            }
        })

        // Check if the job exists
        if (!job) {
            return res.status(404).json({
                message: "Job not found!",
                success: false
            })
        }
        
        return res.status(200).json({
            message: "Applications fetched successfully!",
            job,
            success: true
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Error fetching applications for the recruiter!",
            error,
            success: false
        })
    }
}

const updateApplicationStatus = async (req, res) => {
    try {
        const {status} = req.body
        const applicationId = req.params.id
        if(!status){
            return res.status(400).json({
                message: "Status is required!",
                success: false
            })
        }

        // Find the application
        const application = await Application.findOne({_id:applicationId})
        if (!application) {
            return res.status(404).json({
                message: "Application not found!",
                success: false
            })
        }

        // Update application status
        application.status = status.toLowerCase()
        await application.save()

        return res.status(200).json({
            message: "Application status updated successfully!",
            application,
            success: true
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Error updating application status!",
            error,
            success: false
        });
        
    }
}

module.exports = {
    applyJob,
    getAppliedJobs,
    getApplicants,
    updateApplicationStatus
}
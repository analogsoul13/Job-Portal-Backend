const Job = require("../Models/jobModel")

// Creating job for recruiter
const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body
        const userId = req.user.userId
        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "All fields required !",
                success: false
            })
        }
        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: experience,
            position,
            company: companyId,
            created_by: userId
        })
        return res.status(201).json({
            message: "Job opening created succesfully",
            job,
            success: true
        })
    } catch (error) {
        res.status(500).json({
            message: "Failed posting job!",
            error
        })
    }
}

// to get all jobs for candidate
const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || ""
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        }
        const jobs = await Job.find(query).populate({
            path: "company"
        }).sort({ createdAt: -1 }) // Sort the results by 'createdAt' in descending order (most recent first)
        if (jobs.length === 0) {
            return res.status(404).json({
                message: "No jobs found matching your criteria!",
                success: false
            })
        }
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Error getting all jobs!",
            error,
            success: false
        })

    }
}

// Get JobByID for candidate
const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id
        const job = await Job.findById(jobId)
        if (!job) {
            return res.status(404).json({
                message: "Job Not Found!",
                success: false
            })
        }
        return res.status(200).json({
            job,
            success: true
        })
    } catch (error) {
        res.status(500).json({
            message: "Error fetching Job !!",
            error
        })
    }
}

// For Recruiter /admin 
const getJobsByRecruiter = async (req, res) => {
    try {
        // Ensure the user is a recruiter /saved for later
        const recruiterId = req.user.userId  // user

        const jobs = await Job.find({ created_by: recruiterId }).populate('company')

        if (jobs.length === 0) {
            return res.status(404).json({
                message: "No jobs found for this recruiter!",
                success: false
            })
        }
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
            success: false
        });

    }
}

module.exports = {
    postJob,
    getAllJobs,
    getJobById,
    getJobsByRecruiter
}
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
        const { search, minSalary, maxSalary, location, experienceLevel, page, limit } = req.query
        let query = {}

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        if (!isNaN(minSalary) && !isNaN(maxSalary)) {
            query.salary = {
                $gte: parseInt(minSalary),
                $lte: parseInt(maxSalary)
            };
        }


        if (location) {
            query.location = { $regex: location, $options: "i" }
        }

        if (!isNaN(experienceLevel)) {
            query.experienceLevel = { $lte: parseInt(experienceLevel) };
        }



        const pageNumber = parseInt(page) || 1
        const pageSize = parseInt(limit) || 10
        const skip = (pageNumber - 1) * pageSize

        const jobs = await Job.find(query)
            .populate("company")
            .skip(skip)
            .limit(pageSize)
            .sort({ createdAt: -1 })

        const totalJobs = await Job.countDocuments(query)

        if (jobs.length === 0) {
            return res.status(404).json({
                message: "No jobs found matching the filters",
                success: false
            })
        }

        res.status(200).json({
            totalJobs,
            page: pageNumber,
            totalPages: Math.ceil(totalJobs / pageSize),
            jobs,
            success: true
        });

    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message,
            success: false
        });
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

const getAllLocations = async (req, res) => {
    try {
        const locations = await Job.distinct('location')
        res.status(200).json({ locations })
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch locations' })
    }
}

module.exports = {
    postJob,
    getAllJobs,
    getJobById,
    getJobsByRecruiter,
    getAllLocations
}
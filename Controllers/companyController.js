const Company = require('../Models/companyModel');

// Register Company
const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required",
                success: false,
            });
        }
        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                message: "Company already exists!",
                success: false,
            });
        }
        company = await Company.create({
            name: companyName,
            userId: req.userId,
        });

        return res.status(201).json({
            message: "Company registered successfully!",
            company,
            success: true,
        });
    } catch (error) {
        console.error("Error during company registration:", error.message);
        return res.status(500).json({
            message: "Server error while registering the company.",
            success: false,
        });
    }
};

// Fetch Companies by User
const getCompany = async (req, res) => {
    try {
        const userId = req.user.userId
        const companies = await Company.find({ userId });
        return res.status(200).json({
            message: "Companies fetched successfully!",
            companies: companies || [],
            success: true,
        });
    } catch (error) {
        console.error("Error fetching companies:", error.message);
        return res.status(500).json({
            message: "Server error while fetching companies.",
            success: false,
        });
    }
};

// Fetch Company by ID
const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found!",
                success: false,
            });
        }
        return res.status(200).json({
            company,
            success: true,
        });
    } catch (error) {
        console.error("Error fetching company by ID:", error.message);
        return res.status(500).json({
            message: "Server error while fetching company details.",
            success: false,
        });
    }
};

// Update Company
const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;
        const file = req.file;

        const updateData = {};
        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (website) updateData.website = website;
        if (location) updateData.location = location;

        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false,
            });
        }
        return res.status(200).json({
            message: "Company information updated!",
            company,
            success: true,
        });
    } catch (error) {
        console.error("Error updating company:", error.message);
        return res.status(500).json({
            message: "Server error while updating company details.",
            success: false,
        });
    }
};

module.exports = { registerCompany, getCompany, getCompanyById, updateCompany };

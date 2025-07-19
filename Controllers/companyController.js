const Company = require('../Models/companyModel');
const User = require('../Models/userModel');

// Register Company
const registerCompany = async (req, res) => {
    try {
        const { name, description, location, website } = req.body;
        if (!name) {
            return res.status(400).json({
                message: "Company name is required",
                success: false,
            });
        }
        let company = await Company.findOne({ name });
        if (company) {
            return res.status(400).json({
                message: "Company already exists!",
                success: false,
            });
        }

        const logoPath = req.files?.logo?.[0]?.path;

        company = await Company.create({
            name,
            description,
            location,
            website,
            logo: logoPath ? `/${logoPath}` : "",
            userId: req.user.userId,
        });

        // Update users's (recruiter) company field
        await User.findByIdAndUpdate(
            req.user.userId,
            {
                $set: {
                    'profile.company': company._id,
                },
            },
            { new: true }
        )

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

        const updateData = {};

        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (website) updateData.website = website;
        if (location) updateData.location = location;

        if (req.files && req.files?.logo && req.files.logo.length > 0) {
            updateData.logo = "/uploads/companyLogos/" + req.files.logo[0].filename;
        }

        const company = await Company.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.userId }, // Check ownership
            updateData,
            { new: true });

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

const deletCompany = async (req, res) => {
    try {
        const companyId = req.params.id
        const company = await Company.findById(companyId)
        if (!company) {
            return res.status(404).json({ message: "Company not found" })
        }

        await Company.findByIdAndDelete(companyId)

        await User.updateOne(
            { "profile.company": companyId },
            { $unset: { "profile.company": "" } }
        )

        res.status(200).json({ message: "Company deleted succesfully" })

    } catch (error) {
        console.error("Delete company error:", error)
        res.status(500).json({ message: "Server Error" })
    }
}

module.exports = { registerCompany, getCompany, getCompanyById, updateCompany, deletCompany };

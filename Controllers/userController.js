const User = require('../Models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


// User Register
const register = async (req, res) => {
    try {
        const { first_name, last_name, email, phoneNumber, password, role } = req.body
        if (!first_name || !last_name || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "All fields required !",
                success: false
            })
        }
        // check email already exists
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({
                message: "User already exists!!",
                success: false
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        // create user
        await User.create({
            first_name,
            last_name,
            email,
            phoneNumber,
            password: hashedPassword,
            role
        })

        return res.status(201).json({
            message: "Account created succesfully",
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "An internal server error occurred.",
            success: false
        });


    }
}

// User Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({
                message: "All fields required !",
                success: false
            })
        }
        // check user exists
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password !!",
                success: false
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password !!",
                success: false
            })
        }
        // Generate token
        const tokenData = {
            userId: user._id
        }
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1D' })

        user = {
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile || {}
        }

        return res.status(200).json({
            message: `Welcome Back ${user.first_name}`,
            success: true,
            token,
            role: user.role,
            user: user
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });

    }
}

// Logout
const logout = async (req, res) => {
    try {
        return res.status(200).json({
            message: "Logged out successfully",
            success: true
        });

    } catch (error) {

    }
}

// Get Profile
const getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId).select('-password')
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
        console.log("Error in getProfile:", error);
    }
}

// Update Profile
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const {
            first_name,
            last_name,
            email,
            phoneNumber,
            bio,
            place,
            pin,
            qualification,
            skills,
            github,
            x,
            portfolio
        } = req.body;

        const files = req.files || {};

        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found!" });
        }

        // Handle skills
        const skillsArray = skills ? skills.split(",").map(skill => skill.trim()) : user.profile.skills;

        // Update top-level fields
        user.first_name = first_name ?? user.first_name;
        user.last_name = last_name ?? user.last_name;
        user.email = email ?? user.email;
        user.phoneNumber = phoneNumber ?? user.phoneNumber;

        // Update nested profile fields
        user.profile.bio = bio ?? user.profile.bio;
        user.profile.place = place ?? user.profile.place;
        user.profile.pin = pin ?? user.profile.pin;
        user.profile.qualification = qualification ?? user.profile.qualification;
        user.profile.skills = skillsArray ?? user.profile.skills;

        // Update social links individually
        if (!user.profile.socialLinks) {
            user.profile.socialLinks = {};
        }
        if (github !== undefined) {
            user.profile.socialLinks.github = github;
        }
        if (x !== undefined) {
            user.profile.socialLinks.x = x;
        }
        if (portfolio !== undefined) {
            user.profile.socialLinks.portfolio = portfolio;
        }

        // File uploads
        if (files?.profilePhoto) {
            user.profile.profilePhoto = `/uploads/profilePhotos/${files.profilePhoto[0].filename}`;
        }

        if (files?.resume) {
            user.profile.resume = `/uploads/resumes/${files.resume[0].filename}`;
        }

        // Save changes
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully!",
            user: {
                _id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
                profile: user.profile
            }
        });

    } catch (error) {
        console.error("Error in updateProfile:", error);
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred."
        });
    }
}



// Exporting functions
module.exports = {
    register,
    login,
    logout,
    updateProfile,
    getProfile
};
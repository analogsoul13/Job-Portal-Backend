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


    }
}

// User Login
const login = async (req, res) => {
    try {
        const { email, password, role } = req.body
        if (!email || !password || !role) {
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
        // check role is correct or not
        if (role != user.role) {
            return res.status(400).json({
                message: "Account does not exist with current role !",
                success: false
            })
        }
        // Generate token
        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1D' })

        user = {
            _id: user._id,
            first_name: user.first_name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json({
            message: `Welcome Back ${user.first_name}`,
            success: true
        })
    } catch (error) {
        console.log(error);

    }
}

// Logout
const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged Out Succesfully",
            success: true
        })
    } catch (error) {

    }
}

// Update Profile
const updateProfile = async (req, res) => {
    try {
        const { first_name, last_name, email, phoneNumber, bio, place, pin, qualification, skills } = req.body;
        const file = req.file; // Handle file if necessary

        let skillsArray = [];
        if (skills) {
            skillsArray = skills.split(",");
        }

        const userId = req.userId; // middleware authentication
        console.log("User ID from middleware:", req.userId);

        let user = await User.findById(userId);
        console.log("User found:", user);
        if (!user) {
            return res.status(404).json({
                message: "User not found!",
                success: false
            });
        }

        // Update fields if they exist in the request body
        if (first_name) user.first_name = first_name;
        if (last_name) user.last_name = last_name;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (place) user.profile.place = place;
        if (pin) user.profile.pin = pin;
        if (qualification) user.profile.qualification = qualification;
        if (skills) user.profile.skills = skillsArray;

        // Save the updated user
        await user.save();

        // Clean user object for the response
        user = {
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).json({
            message: "Profile Updated Successfully!",
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "An internal server error occurred.",
            success: false
        });
    }
};


// Exporting functions
module.exports = {
    register,
    login,
    logout,
    updateProfile
};
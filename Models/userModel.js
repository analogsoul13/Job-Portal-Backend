const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
    },
    phoneNumber: {
        type: Number,
        required: true,
        unique: true,
        min: [1000000000, "Phone number must be at least 10 digits"],
        max: [999999999999, "Phone number cannot exceed 12 digits"]
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['candidate', 'recruiter'],
        required: true
    },
    profile: {
        bio: { type: String, trim: true, maxlength: 500 },
        place: { type: String },
        pin: { type: Number },
        qualification: { type: String },
        skills: [{ type: String }],
        resume: { type: String },
        company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
        profilePhoto: {
            type: String,
            default: "https://static-00.iconduck.com/assets.00/avatar-default-icon-988x1024-zsfboql5.png"
        },
        socialLinks: {
            github: { type: String },
            x: { type: String },
            portfolio: { type: String }
        }
    },
}, { timestamps: true })

const User = mongoose.model('User', userSchema)

module.exports = User
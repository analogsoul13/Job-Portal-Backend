const multer = require('multer');
const path = require("path")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "profilePhoto") {
            cb(null, "uploads/profilePhotos") // Storing in specific folder
        } else if (file.fieldname === "resume") {
            cb(null, "uploads/resumes") // storing resume in different folder
        } else {
            cb(new Error("Invalid file field"), false)
        }
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Generate unique filenames
    }
});

const fileFilter = (req, file, cb) => {
    if (file.fieldname === "profilePhoto") {
        // Allow only images for profile photos
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Only image files are allowed for profile photos!"), false);
        }
    } else if (file.fieldname === "resume") {
        // Allow only PDFs for resumes
        if (file.mimetype !== "application/pdf") {
            return cb(new Error("Only PDF files are allowed for resumes!"), false);
        }
    }
    cb(null, true)
};

// Multer Upload Middleware
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
}).fields([
    { name: "profilePhoto", maxCount: 1 }, 
    { name: "resume", maxCount: 1 }
]);

module.exports = upload;

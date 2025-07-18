const fs = require('fs')
const multer = require('multer');


// Ensure the upload folders exist
const ensureDirectoryExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = "uploads";

        if (file.fieldname === "profilePhoto") {
            uploadPath = "uploads/profilePhotos";
        } else if (file.fieldname === "resume") {
            uploadPath = "uploads/resumes";
        } else if (file.fieldname === "logo") {
            uploadPath = "uploads/companyLogos";
        } else {
            return cb(new Error("Invalid file field"), false);
        }

        ensureDirectoryExists(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.fieldname === "profilePhoto") {
        // Allow only images for profile photos
        if (!file.mimetype.startsWith("image")) {
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
    { name: "resume", maxCount: 1 },
    { name: "logo", maxCount: 1 }
]);

module.exports = upload;

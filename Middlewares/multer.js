const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads'); // Store files in the "uploads" folder
    },
    filename: (req, file, cb) => {
        cb(null, `Image-${Date.now()}-${file.originalname}`); // Generate unique filenames
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    } else {
        cb(new Error("The file must be in JPG, JPEG, or PNG format"));
    }
};

module.exports = multer({ storage, fileFilter });

import multer from "multer";

// Image upload code
let storage = multer.diskStorage({
  destination: "./upload/images", // directory (folder) setting
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname); // file name setting
  },
});

// Upload Setting validation
let upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/png" ||
      file.mimetype == "image/gif" ||
      file.mimetype == "image/avif"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      cb(new Error("Only jpeg, jpg, png, and gif Image allow"));
    }
  },
});

export default upload;

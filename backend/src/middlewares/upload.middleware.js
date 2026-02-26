const multer = require("multer");
const path = require("path");
const fs = require("fs");

function makeUploader(folderName) {
  const uploadDir = path.join(process.cwd(), "uploads", folderName);
  fs.mkdirSync(uploadDir, { recursive: true });

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
      const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueName + path.extname(file.originalname));
    },
  });

  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only images are allowed"), false);
  };

  return multer({ storage, fileFilter });
}

const uploadCoffeeImage = makeUploader("coffees");
const uploadMachineImage = makeUploader("machines");
const uploadAvatarImage = makeUploader("avatars");

module.exports = { uploadCoffeeImage, uploadMachineImage, uploadAvatarImage };

import path from "path";
import multer from "multer";
const upload = multer({
  dest: "uploads/",
  storage: multer.diskStorage
  ({
    destination: "uploads/",
    filename: (_req, file, cb) => {
      cb(null, Date.now()+"_"+file.originalname);
    },
  }),
});

export default upload;
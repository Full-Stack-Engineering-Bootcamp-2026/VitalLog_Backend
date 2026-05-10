import multer from "multer";
import { BadRequestException } from "../exceptions/bad-request.exception";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_SIZE_MB = 5;

export const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: MAX_SIZE_MB * 1024 * 1024,
  },

  fileFilter: (_req, file, callback) => {
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      return callback(
        new BadRequestException(
          "Only JPEG, JPG, PNG and WEBP images are allowed",
        ),
      );
    }

    callback(null, true);
  },
});

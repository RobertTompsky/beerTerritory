import multer from "multer";
import path from "path";
import { Request } from 'express'

const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function (req: Request, file: Express.Multer.File, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

export const upload = multer({
  storage,
})

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

type Callback = (error: Error | null, allowed: boolean) => void;

const fileFilter = (req: Request, file: Express.Multer.File, cb: Callback) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Неподдерживаемый тип файла'), false);
  }
};

const limits = {
  fileSize: 1024 * 1024 // Максимальный размер файла 1 МБ
};

export const upload = multer({
  storage,
})

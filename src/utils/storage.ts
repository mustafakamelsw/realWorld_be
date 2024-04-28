import { Request } from 'express';
import multer, { FileFilterCallback, diskStorage } from 'multer';

export const storage = diskStorage({
  destination: function (
    req: Request,
    file: Express.Multer.File,
    cb: Function
  ) {
    cb(null, __dirname + '../../images');
  },
  filename: function (req: Request, file: Express.Multer.File, cb: Function) {
    cb(null, file.fieldname + '-' + new Date().toISOString());
  },
});
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter,
});

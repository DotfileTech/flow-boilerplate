import multer from 'multer';

const whitelist = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'application/pdf',
];

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: Number(20000000) }, // 20 Mo in bytes
  fileFilter: (req, file, cb) => {
    if (whitelist.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Mimetype is not allowed'));
    }
  },
}).any();

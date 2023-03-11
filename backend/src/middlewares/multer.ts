import multer from 'multer'

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: Number(process.env.TEMPLATE_MAX_SIZE ?? 5048576) },
  // fileFilter: (req, file, cb) => {
  //   if (
  //     file.mimetype ==
  //       'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
  //     file.mimetype == 'application/pdf'
  //   ) {
  //     cb(null, true)
  //   } else {
  //     cb(null, false)
  //     return cb(new Error('Only .pdf format allowed!'))
  //   }
  // },
}).single('file')

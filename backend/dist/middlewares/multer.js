"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const tslib_1 = require("tslib");
const multer_1 = tslib_1.__importDefault(require("multer"));
exports.upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: Number((_a = process.env.TEMPLATE_MAX_SIZE) !== null && _a !== void 0 ? _a : 5048576) },
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
})
    // .single('file')
    // .array('file')
    .any();
//# sourceMappingURL=multer.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailOptions = void 0;
exports.mailOptions = {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    tls: {
        rejectUnauthorized: false,
    },
    auth: {
        user: `${process.env.EMAIL}`,
        pass: `${process.env.EMAIL_PASS}`,
    },
};
//# sourceMappingURL=index.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const nodemailer_1 = tslib_1.__importDefault(require("nodemailer"));
// import hbs from 'nodemailer-express-handlebars'
const mailOptions = {
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
class EmailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport(mailOptions);
        this.sendEmail = (email, options) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // this.transporter.use(
            //   'compile',
            //   hbs({
            //     viewEngine: {
            //       extName: '.handlebars',
            //       partialsDir: './templates/',
            //       layoutsDir: './templates/',
            //     },
            //     viewPath: './templates/',
            //     extName: '.handlebars',
            //   }),
            // )
            const message = {
                from: 'contact@docagen.com',
                to: email,
                subject: options.subject,
                // text: 'Plaintext version of the message',
                // html: `<p>${options.message}</p>`,
                template: '',
                // context: {
                //   appLogoUrl: "https://maddyness.twic.pics/2023/02/Dotfile.png?twic=v1/resize=470",
                //   verificationLink: "http",
                //   name: fullName,
                // },
            };
            return this.transporter.sendMail(message);
        });
    }
}
exports.default = EmailService;
//# sourceMappingURL=email.service.js.map
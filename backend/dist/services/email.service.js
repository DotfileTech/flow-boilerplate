"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const nodemailer_1 = tslib_1.__importDefault(require("nodemailer"));
const nodemailer_express_handlebars_1 = tslib_1.__importDefault(require("nodemailer-express-handlebars"));
const path_1 = tslib_1.__importDefault(require("path"));
const mailOptions = {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    tls: {
        rejectUnauthorized: false,
    },
    auth: {
        user: `${process.env.EMAIL_USER}`,
        pass: `${process.env.EMAIL_PASSWORD}`,
    },
};
class EmailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport(mailOptions);
        this.sendEmail = (email, options, context) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.transporter.use('compile', (0, nodemailer_express_handlebars_1.default)({
                viewEngine: {
                    extName: '.handlebars',
                    partialsDir: path_1.default.join(__dirname, 'templates'),
                    layoutsDir: path_1.default.join(__dirname, 'templates'),
                    defaultLayout: options.template,
                },
                viewPath: path_1.default.join(__dirname, 'templates'),
                extName: '.handlebars',
            }));
            console.log(options);
            const message = {
                from: process.env.EMAIL_FROM,
                to: email,
                subject: options.subject,
                // text: 'Plaintext version of the message',
                // html: `<p>${options.message}</p>`,
                template: options.template,
                context,
            };
            return this.transporter.sendMail(message);
        });
    }
}
exports.default = EmailService;
//# sourceMappingURL=email.service.js.map
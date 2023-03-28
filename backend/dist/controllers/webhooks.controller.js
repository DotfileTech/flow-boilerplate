"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const email_service_1 = tslib_1.__importDefault(require("../services/email.service"));
const dotfile_api_1 = tslib_1.__importDefault(require("../api/dotfile.api"));
class WebhooksController {
    constructor() {
        this.dotfileApi = new dotfile_api_1.default({
            host: process.env.DOTFILE_BASE_URL,
            secretKey: process.env.DOTFILE_KEY,
        });
        this.emailService = new email_service_1.default();
        this.checksConsumer = (req, res, next) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const payload = req.body;
                if (payload.event !== 'Check.Completed')
                    return res.status(200).json({});
                const caseId = payload.context.case.id;
                const check = payload.check;
                const checkResult = payload.check.data.result;
                const caseData = yield this.dotfileApi.request('get', `cases/${caseId}`, {}, {}, {});
                const email = caseData.metadata.email;
                switch (checkResult) {
                    case 'rejected':
                        if (email)
                            yield this.emailService.sendEmail(email, {
                                template: 'checkRejected',
                                subject: 'Document rejected',
                                message: '',
                            }, {
                                link: `${process.env.APP_URL}/?caseId=${caseId}`,
                                appLogoUrl: process.env.LOGO_URL,
                                check,
                            });
                        break;
                    case 'approved':
                    default:
                }
                return res.status(200).json({});
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.default = WebhooksController;
//# sourceMappingURL=webhooks.controller.js.map
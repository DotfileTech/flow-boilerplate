"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importStar(require("express"));
const multer_1 = require("../middlewares/multer");
const dotfile_controller_1 = tslib_1.__importDefault(require("../controllers/dotfile.controller"));
class PublicApiRoute {
    constructor() {
        this.path = '/';
        this.router = (0, express_1.Router)();
        this.dotfileController = new dotfile_controller_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.use(express_1.default.json());
        // this.router.use(rateLimiterMiddleware, bearerCheck)
        this.router.get(`${this.path}countries`, this.dotfileController.getCountries);
        this.router.get(`${this.path}companies`, this.dotfileController.searchCompanies);
        this.router.get(`${this.path}companies/:id`, this.dotfileController.fetchCompany);
        this.router.post(`${this.path}cases`, this.dotfileController.createCase);
        this.router.get(`${this.path}cases/:id`, this.dotfileController.fetchCase);
        this.router.post(`${this.path}checks`, this.dotfileController.fetchCheck);
        this.router.post(`${this.path}documents`, function (req, res, next) {
            (0, multer_1.upload)(req, res, function (err) {
                if (err) {
                    return res.status(400).send({ message: err.message });
                }
                next();
            });
        }, this.dotfileController.uploadDocument);
        this.router.post(`${this.path}identity_documents`, function (req, res, next) {
            (0, multer_1.upload)(req, res, function (err) {
                if (err) {
                    return res.status(400).send({ message: err.message });
                }
                next();
            });
        }, this.dotfileController.uploadIdentityDocument);
        this.router.use((req, res) => {
            res.status(404).send({
                type: 'route_not_found',
                message: 'The required route does not exist.',
                code: 404,
            });
        });
    }
}
exports.default = PublicApiRoute;
//# sourceMappingURL=dotfile.route.js.map
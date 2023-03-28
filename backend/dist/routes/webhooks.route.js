"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importStar(require("express"));
const webhooks_controller_1 = tslib_1.__importDefault(require("../controllers/webhooks.controller"));
class PublicApiRoute {
    constructor() {
        this.path = '/';
        this.router = (0, express_1.Router)();
        this.webhookController = new webhooks_controller_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.use(express_1.default.json());
        this.router.post(`${this.path}checks`, this.webhookController.checksConsumer);
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
//# sourceMappingURL=webhooks.route.js.map
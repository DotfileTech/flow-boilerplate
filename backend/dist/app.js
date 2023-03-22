"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const cors_1 = tslib_1.__importDefault(require("cors"));
const dotfile_route_1 = tslib_1.__importDefault(require("./routes/dotfile.route"));
const webhooks_route_1 = tslib_1.__importDefault(require("./routes/webhooks.route"));
const app = (0, express_1.default)();
//  CORS disabled in development
app.options('*', (0, cors_1.default)());
app.use((0, cors_1.default)({
    credentials: true,
    preflightContinue: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    origin: '*',
}));
app.get('/health', (req, res) => {
    const data = {
        uptime: process.uptime(),
        message: 'Everything works fine',
        date: new Date(),
    };
    res.status(200).send(data);
});
app.use('/webhooks', new webhooks_route_1.default().router);
app.use('/dotfile', new dotfile_route_1.default().router);
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});
exports.default = app;
//# sourceMappingURL=app.js.map
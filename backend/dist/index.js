"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = tslib_1.__importDefault(require("./app"));
const PORT = process.env.PORT || 5000;
const server = app_1.default.listen(PORT, () => {
    console.info(`Dotfile Demozone Listening to port ${PORT}`);
});
app_1.default.disable('x-powered-by');
const exitHandler = () => {
    if (server) {
        server.close(() => {
            console.info('Server closed');
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
};
const unexpectedErrorHandler = (error) => {
    console.error(error);
    exitHandler();
};
process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);
process.on('SIGTERM', () => {
    console.info('SIGTERM received');
    if (server) {
        server.close();
    }
});
//# sourceMappingURL=index.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
class Dotfile {
    constructor(config = {}) {
        config.host = config.host || 'https://api.dotfile.com/v1';
        this.serverUrl = config.host;
        if (this.serverUrl.slice(-1) === '/') {
            this.serverUrl = this.serverUrl.slice(0, -1);
        }
        try {
            new URL(this.serverUrl);
        }
        catch (err) {
            throw new Error(`Invalid URL provided for the Dotfile host: ${this.serverUrl}`);
        }
        this.secretKey = config.secretKey || '';
    }
    request(method, endpoint, params, payload, headers) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const url = `${this.serverUrl}/${endpoint}`;
            const { data } = yield (0, axios_1.default)(url, {
                method,
                params,
                headers: Object.assign({ 'Content-Type': 'application/json', 'Accept-Encoding': 'application/json', 'X-DOTFILE-API-KEY': this.secretKey }, headers),
                data: payload,
            });
            return data;
        });
    }
}
exports.default = Dotfile;
//# sourceMappingURL=dotfile.api.js.map
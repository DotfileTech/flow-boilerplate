"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const form_data_1 = tslib_1.__importDefault(require("form-data"));
const dotfile_api_1 = tslib_1.__importDefault(require("../api/dotfile.api"));
class DotfileController {
    constructor() {
        this.dotfileApi = new dotfile_api_1.default({
            host: process.env.DOTFILE_BASE_URL,
            secretKey: process.env.DOTFILE_KEY,
        });
        this.getCountries = (req, res, next) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const countries = yield this.dotfileApi.request('get', 'company-data/countries', {}, {}, {});
                res.status(200).json(countries);
            }
            catch (err) {
                res.status(400).send({
                    type: 'error',
                    message: 'Something went wrong while fetching countries list.',
                });
            }
        });
        this.searchCompanies = (req, res, next) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const companies = yield this.dotfileApi.request('get', 'company-data/search', { country: req.query.country, name: req.query.name }, {}, {});
                res.status(200).json(companies);
            }
            catch (err) {
                res.status(400).send({
                    type: 'error',
                    message: 'Something went wrong while searching company.',
                });
            }
        });
        this.fetchCompany = (req, res, next) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const company = yield this.dotfileApi.request('get', `company-data/fetch/${req.params.id}`, {}, {}, {});
                company.individuals = company.beneficial_owners.map((ubo) => {
                    return Object.assign({ roles: ['beneficial_owner'] }, ubo);
                });
                res.status(200).json(company);
            }
            catch (err) {
                res.status(400).send({
                    type: 'error',
                    message: 'Something went wrong while fetch company details.',
                });
            }
        });
        this.createCase = (req, res, next) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const { company, individuals, metadata } = req.body;
                const createdCase = yield this.dotfileApi.request('post', 'cases', {}, {
                    name: company.name,
                    // external_id: email,
                    template_id: process.env.TEMPLATE_ID,
                    metadata: Object.keys(metadata)
                        .filter((k) => metadata[k] != null)
                        .reduce((a, k) => (Object.assign(Object.assign({}, a), { [k]: metadata[k] })), {}),
                }, {});
                individuals.forEach((individual) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    yield this.dotfileApi.request('post', 'individuals', {}, {
                        case_id: createdCase.id,
                        first_name: individual.first_name,
                        last_name: individual.last_name,
                        roles: individual.roles,
                    }, {});
                }));
                yield this.dotfileApi.request('post', 'companies', {}, {
                    case_id: createdCase.id,
                    name: company.name,
                    registration_number: company.registration_number,
                    country: company.country,
                    legal_form: company.legal_form,
                }, {});
                res.status(200).json({
                    caseId: createdCase.id,
                });
            }
            catch (err) {
                res.status(400).send({
                    type: 'error',
                    message: 'Something went wrong while creating case.',
                });
            }
        });
        this.fetchCase = (req, res, next) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const caseData = yield this.dotfileApi.request('get', `cases/${req.params.id}`, {}, {}, {});
                let enrichedCompanies = [];
                for (const company of caseData.companies) {
                    let enrichedChecks = [];
                    for (const check of company.checks) {
                        // enrichedChecks.push(check)
                        const enrichedCheck = yield this.dotfileApi.request('get', `checks/${check.type}/${check.id}`, {}, {}, {});
                        enrichedChecks.push(enrichedCheck);
                    }
                    company.checks = enrichedChecks;
                    enrichedCompanies.push(company);
                }
                let enrichedIndividuals = [];
                for (const individual of caseData.individuals) {
                    let enrichedChecks = [];
                    for (const check of individual.checks) {
                        // enrichedChecks.push(check)
                        const enrichedCheck = yield this.dotfileApi.request('get', `checks/${check.type}/${check.id}`, {}, {}, {});
                        enrichedChecks.push(enrichedCheck);
                    }
                    individual.checks = enrichedChecks;
                    enrichedIndividuals.push(individual);
                }
                caseData.companies = enrichedCompanies;
                caseData.individuals = enrichedIndividuals;
                res.status(200).json(caseData);
            }
            catch (err) {
                console.log(err);
                res.status(400).send({
                    type: 'error',
                    message: 'Something went wrong while fetching case.',
                });
            }
        });
        this.fetchCheck = (req, res, next) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const { checkId, type } = req.body;
                const check = yield this.dotfileApi.request('get', `checks/${type}/${checkId}`, {}, {}, {});
                res.status(200).json({
                    url: check.data.vendor.verification_url,
                });
            }
            catch (err) {
                res.status(400).send({
                    type: 'error',
                    message: 'Something went wrong while fetching check.',
                });
            }
        });
        this.uploadDocument = (req, res, next) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const bodyFormData = new form_data_1.default();
                bodyFormData.append('file', req.files[0].buffer, {
                    filename: req.files[0].originalname,
                });
                const { checkId, type } = req.body;
                const { upload_ref } = yield this.dotfileApi.request('post', `files/upload`, {}, bodyFormData, Object.assign({}, bodyFormData.getHeaders()));
                const completedChecks = yield this.dotfileApi.request('post', `checks/${type}/${checkId}/add_files`, {}, {
                    files: [
                        {
                            upload_ref,
                        },
                    ],
                }, {});
                res.status(200).json(completedChecks);
            }
            catch (err) {
                res.status(400).send({
                    type: 'error',
                    message: 'Something went wrong while uploading documents',
                });
            }
        });
        this.uploadIdentityDocument = (req, res, next) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.files[0])
                    throw new Error('missing file');
                const bodyFormDataFront = new form_data_1.default();
                bodyFormDataFront.append('file', req.files[0].buffer, {
                    filename: req.files[0].originalname,
                });
                const { checkId, type } = req.body;
                const { upload_ref: front_upload_ref } = yield this.dotfileApi.request('post', `files/upload`, {}, bodyFormDataFront, Object.assign({}, bodyFormDataFront.getHeaders()));
                let back_upload_ref;
                if (req.files[1]) {
                    const bodyFormDataBack2 = new form_data_1.default();
                    bodyFormDataFront.append('file', req.files[1].buffer, {
                        filename: req.files[1].originalname,
                    });
                    const { upload_ref } = yield this.dotfileApi.request('post', `files/upload`, {}, bodyFormDataBack2, Object.assign({}, bodyFormDataBack2.getHeaders()));
                    back_upload_ref = upload_ref;
                }
                const completedChecks = yield this.dotfileApi.request('post', `checks/${type}/${checkId}/add_files`, {}, {
                    front_upload_ref,
                    back_upload_ref,
                }, {});
                res.status(200).json(completedChecks);
            }
            catch (err) {
                console.log(err);
                res.status(400).send({
                    type: 'error',
                    message: 'Something went wrong while uploading identity documents',
                });
            }
        });
    }
}
exports.default = DotfileController;
//# sourceMappingURL=dotfile.controller.js.map
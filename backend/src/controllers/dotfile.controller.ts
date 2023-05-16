import { Request, Response } from 'express';
import FormData from 'form-data';
import axios from 'axios';

import Dotfile from '../api/dotfile.api';
import {
  Case,
  CaseDetailed,
  CompanyData,
  CompanySearch,
  Country,
  CaseMetadata,
  CompanyInput,
  IndividualInput,
} from '../types';

type GetCasesResponse = {
  data: Case[];
};

class DotfileController {
  public dotfileApi = new Dotfile({
    host: process.env.DOTFILE_BASE_URL,
    secretKey: process.env.DOTFILE_KEY,
    isDev: process.env.NODE_ENV === 'development',
  });

  private upload = async (file): Promise<string> => {
    const bodyFormData = new FormData();
    bodyFormData.append('file', file.buffer, {
      filename: file.originalname,
    });
    const { upload_ref }: { upload_ref: string } =
      await this.dotfileApi.request('post', `files/upload`, {}, bodyFormData, {
        ...bodyFormData.getHeaders(),
      });

    return upload_ref;
  };

  private getCountries = async (): Promise<Country[]> => {
    try {
      return await this.dotfileApi.request(
        'get',
        'company-data/countries',
        {},
        {},
        {}
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          `[${error.request.path}] Error ${error.response.status} (${error.response.statusText}): ${error.response.data.message}`
        );
      } else {
        console.error('[getCountries] Unexpected error: ', error);
      }

      return [];
    }
  };

  public searchCompanies = async (req: Request, res: Response) => {
    try {
      const { country, name, registration_number } = req.query;

      const availableCountries = await this.getCountries();

      if (availableCountries.some((c: Country) => c.code === country)) {
        const companies: CompanySearch[] = await this.dotfileApi.request(
          'get',
          'company-data/search',
          {
            country,
            name,
            registration_number,
          },
          {},
          {}
        );
        res.status(200).json(companies);
      } else {
        res.status(200).json({ data: { data: [] } });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          `[${error.request.path}] Error ${error.response.status} (${error.response.statusText}): ${error.response.data.message}`
        );
        res.status(error.response.status).send({
          type: 'error',
          message: `Error ${error.response.status} (${error.response.statusText}): ${error.response.data.message}`,
        });
      } else {
        console.error('[searchCompanies] Unexpected error: ', error);
        res.status(400).send({
          type: 'error',
          message: '[searchCompanies] An unexpected error occurred',
        });
      }
    }
  };

  public fetchCompany = async (req: Request, res: Response) => {
    try {
      const company: CompanyData = await this.dotfileApi.request(
        'get',
        `company-data/fetch/${req.params.id}`,
        {},
        {},
        {}
      );

      res.status(200).json(company);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          `[${error.request.path}] Error ${error.response.status} (${error.response.statusText}): ${error.response.data.message}`
        );
        res.status(error.response.status).send({
          type: 'error',
          message: `Error ${error.response.status} (${error.response.statusText}): ${error.response.data.message}`,
        });
      } else {
        console.error('[fetchCompany] Unexpected error: ', error);
        res.status(400).send({
          type: 'error',
          message: '[fetchCompany] An unexpected error occurred',
        });
      }
    }
  };

  public createCase = async (req: Request, res: Response) => {
    try {
      const {
        company,
        individuals,
        metadata,
        email,
        externalId,
      }: {
        company: CompanyInput;
        individuals: IndividualInput[];
        metadata: CaseMetadata;
        email: string;
        externalId: string;
      } = req.body;

      const template_id: string = process.env.TEMPLATE_ID;

      // Custom config
      // For several templates, create a mapping between a metadata and the corresponding template
      /*switch (metadata['company_structure']) {
        case 'private_company':
          template_id = process.env.TEMPLATE_PRIVATE_COMPANY
          break
        case 'public_company':
          template_id = process.env.TEMPLATE_PUBLIC_COMPANY
          break
        case 'association':
          template_id = process.env.TEMPLATE_ASSOCIATION
          break
        case 'self_employed':
          template_id = process.env.TEMPLATE_SELF_EMPLOYED
          break
        default:
          template_id = process.env.TEMPLATE_ID
      }*/

      const caseName = company
        ? `KYB - ${company.name}`
        : `KYC - ${individuals[0].first_name} ${individuals[0].last_name}`;

      const createdCase: Case = await this.dotfileApi.request(
        'post',
        'cases',
        {},
        {
          name: caseName,
          ...(externalId && { external_id: externalId }),
          template_id: template_id || null,
          metadata: Object.keys(metadata)
            .filter((k) => metadata[k] != null)
            .reduce((a, k) => ({ ...a, [k]: metadata[k] }), {}),
        },
        {}
      );

      if (individuals.length > 0) {
        for (const individual of individuals) {
          let individualEmail = individual.email;

          // @NOTE If there is no roles, it's a KYC and the default role is "applicant" with a required email
          if (!individual.roles && email) {
            individualEmail = email;
          }
          await this.dotfileApi.request(
            'post',
            'individuals',
            {},
            {
              // Required
              case_id: createdCase.id,
              roles: individual.roles || ['applicant'],
              first_name: individual.first_name,
              last_name: individual.last_name,
              // Optional
              email: individualEmail,
              birth_date: individual.birth_date,
              birth_country: individual.birth_country,
              birth_place: individual.birth_place,
              address: {
                street_address: individual.address?.street_address,
                street_address_2: individual.address?.street_address_2,
                postal_code: individual.address?.postal_code,
                city: individual.address?.city,
                state: individual.address?.state,
                region: individual.address?.region,
                country: individual.address?.country,
              },
              banking_information: {
                iban: individual.banking_information?.iban,
                bic: individual.banking_information?.bic,
              },
              tax_identification_number: individual.tax_identification_number,
              social_security_number: individual.social_security_number,
              phone_number: individual.phone_number,
              position: individual.position,
              ownership_percentage: individual.ownership_percentage,
            },
            {}
          );
        }
      }

      if (company) {
        const classifications = [];
        if (
          company.classifications &&
          company.classifications.length > 0 &&
          company.country === 'FR'
        ) {
          classifications.push({
            type: company.classifications[0].type ?? 'NAF',
            code: company.classifications[0].code,
            description: company.classifications[0].description,
          });
        }

        await this.dotfileApi.request(
          'post',
          'companies',
          {},
          {
            // Required
            case_id: createdCase.id,
            name: company.name,
            registration_number: company.registration_number,
            country: company.country,
            // Optional
            registration_date: company.registration_date,
            status: company.status,
            legal_form: company.legal_form,
            address: {
              street_address: company.address?.street_address,
              street_address_2: company.address?.street_address_2,
              postal_code: company.address?.postal_code,
              city: company.address?.city,
              state: company.address?.state,
              region: company.address?.region,
              country: company.address?.country,
            },
            banking_information: {
              iban: company.banking_information?.iban,
              bic: company.banking_information?.bic,
            },
            classifications,
            tax_identification_number: company.tax_identification_number,
            website_url: company.website_url,
            employer_identification_number:
              company.employer_identification_number,
          },
          {}
        );
      }

      res.status(200).json({
        caseId: createdCase.id,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          `[${error.request.path}] Error ${error.response.status} (${error.response.statusText}): ${error.response.data.message}.\n\n${error.response.data.errors}`
        );
        res.status(error.response.status).send({
          type: 'error',
          message: `Error ${error.response.status} (${error.response.statusText}): ${error.response.data.message}. ${error.response.data.errors}`,
        });
      } else {
        console.error('[createCase] Unexpected error: ', error);
        res.status(400).send({
          type: 'error',
          message: '[createCase] An unexpected error occurred',
        });
      }
    }
  };

  public getCases = async (req: Request, res: Response) => {
    try {
      const cases: GetCasesResponse = await this.dotfileApi.request(
        'get',
        `cases`,
        { external_id: req.query.externalId },
        {},
        {}
      );
      res.status(200).json(cases.data[0]);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          `[${error.request.path}] Error ${error.response.status} (${error.response.statusText}): ${error.response.data.message}`
        );
        res.status(error.response.status).send({
          type: 'error',
          message: `Error ${error.response.status} (${error.response.statusText}): ${error.response.data.message}`,
        });
      } else {
        console.error('[getCases] Unexpected error: ', error);
        res.status(400).send({
          type: 'error',
          message: '[getCases] An unexpected error occurred',
        });
      }
    }
  };

  public fetchCase = async (req: Request, res: Response) => {
    try {
      const caseData: CaseDetailed = await this.dotfileApi.request(
        'get',
        `cases/${req.params.id}`,
        {},
        {},
        {}
      );

      const enrichedCompanies = [];

      for (const company of caseData.companies) {
        const enrichedChecks = [];
        for (const check of company.checks) {
          const enrichedCheck = await this.dotfileApi.request(
            'get',
            `checks/${check.type}/${check.id}`,
            {},
            {},
            {}
          );

          enrichedChecks.push(enrichedCheck);
        }
        company.checks = enrichedChecks;
        enrichedCompanies.push(company);
      }

      const enrichedIndividuals = [];

      for (const individual of caseData.individuals) {
        const enrichedChecks = [];
        for (const check of individual.checks) {
          const enrichedCheck = await this.dotfileApi.request(
            'get',
            `checks/${check.type}/${check.id}`,
            {},
            {},
            {}
          );

          enrichedChecks.push(enrichedCheck);
        }
        individual.checks = enrichedChecks;
        enrichedIndividuals.push(individual);
      }

      caseData.companies = enrichedCompanies;
      caseData.individuals = enrichedIndividuals;

      res.status(200).json(caseData);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          `[${error.request.path}] Error ${error.response.status} (${error.response.statusText}): ${error.response.data.message}`
        );
        res.status(error.response.status).send({
          type: 'error',
          message: `Error ${error.response.status} (${error.response.statusText}): ${error.response.data.message}`,
        });
      } else {
        console.error('[fetchCase] Unexpected error: ', error);
        res.status(400).send({
          type: 'error',
          message: '[fetchCase] An unexpected error occurred',
        });
      }
    }
  };

  public fetchCheck = async (req: Request, res: Response) => {
    try {
      const { checkId, type } = req.body;

      const check = await this.dotfileApi.request(
        'get',
        `checks/${type}/${checkId}`,
        {},
        {},
        {}
      );

      res.status(200).json({
        url: check.data.vendor.verification_url,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          `[${error.request.path}] Error ${error.response.status} (${error.response.statusText}): ${error.response.data.message}`
        );
        res.status(error.response.status).send({
          type: 'error',
          message: `Error ${error.response.status} (${error.response.statusText}): ${error.response.data.message}`,
        });
      } else {
        console.error('[fetchCheck] Unexpected error: ', error);
        res.status(400).send({
          type: 'error',
          message: '[fetchCheck] An unexpected error occurred',
        });
      }
    }
  };

  public uploadDocument = async (req: Request, res: Response) => {
    try {
      const files = [];

      for (let i = 0; i < (req.files.length as number); i++) {
        const uploadRef = await this.upload(req.files[i]);
        files.push({
          upload_ref: uploadRef,
        });
      }

      const { checkId, type } = req.body;

      const completedChecks = await this.dotfileApi.request(
        'post',
        `checks/${type}/${checkId}/add_files`,
        {},
        {
          files,
        },
        {}
      );

      res.status(200).json(completedChecks);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          `[${error.request.path}] Error ${error.response.status} (${error.response.statusText}): ${error.response.data.message}`
        );
        res.status(error.response.status).send({
          type: 'error',
          message: `Error ${error.response.status} (${error.response.statusText}): ${error.response.data.message}`,
        });
      } else {
        console.error('[uploadDocument] Unexpected error: ', error);
        res.status(400).send({
          type: 'error',
          message: '[uploadDocument] An unexpected error occurred',
        });
      }
    }
  };

  public uploadIdentityDocument = async (req: Request, res: Response) => {
    try {
      if (!req.files[0]) {
        throw new Error('missing file');
      }

      const { checkId, type } = req.body;

      const front_upload_ref = await this.upload(req.files[0]);

      let back_upload_ref;

      if (req.files[1]) {
        back_upload_ref = await this.upload(req.files[1]);
      }

      const completedChecks = await this.dotfileApi.request(
        'post',
        `checks/${type}/${checkId}/add_files`,
        {},
        {
          front_upload_ref,
          back_upload_ref,
        },
        {}
      );

      res.status(200).json(completedChecks);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          `[${error.request.path}] Error ${error.response.status} (${error.response.statusText}): ${error.response.data.message}`
        );
        res.status(error.response.status).send({
          type: 'error',
          message: `Error ${error.response.status} (${error.response.statusText}): ${error.response.data.message}`,
        });
      } else {
        console.error('[uploadIdentityDocument] Unexpected error: ', error);
        res.status(400).send({
          type: 'error',
          message: '[uploadIdentityDocument] An unexpected error occurred',
        });
      }
    }
  };
}

export default DotfileController;

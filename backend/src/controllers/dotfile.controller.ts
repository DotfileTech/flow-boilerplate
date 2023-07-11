import { Request, Response } from 'express';
import FormData from 'form-data';
import axios from 'axios';
import 'reflect-metadata';
import { plainToClass } from 'class-transformer';
import { z } from 'zod';

import Dotfile from '../api/dotfile.api';
import {
  Case,
  CaseDetailed,
  CaseMetadata,
  CompanyData,
  CompanyInput,
  CompanySearch,
  Country,
  IndividualInput,
} from '../types';
import {
  CheckStatusEnum,
  CheckTypeEnum,
  IndividualRoleEnum,
} from '../constants';
import { templateMapping } from '../config/template-mapping';
import { CaseDetailedDTO } from './dto/case-detailed.dto';
import { CheckDTO } from './dto/check.dto';
import { caseSchema } from './validation/case.schema';

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
    const inputSchema = z
      .object({
        country: z.string().length(2),
        name: z.string().optional(),
        registration_number: z.string().optional(),
      })
      .required({
        country: true,
      })
      .refine((input) => !!input.name || !!input.registration_number);

    const validation = inputSchema.safeParse(req.query);

    if (!validation.success) {
      console.error(
        `[searchCompanies] Validation failed: `,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        validation.error.issues
      );
      res.status(400).json({
        type: 'BAD_REQUEST',
        message: '[searchCompanies] Validation failed',
      });
      return;
    }

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
    const inputSchema = z.object({
      id: z.string(),
    });

    const validation = inputSchema.safeParse(req.params);

    if (!validation.success) {
      console.error(
        `[fetchCompany] Validation failed: `,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        validation.error.issues
      );
      res.status(400).json({
        type: 'BAD_REQUEST',
        message: '[fetchCompany] Validation failed',
      });
      return;
    }

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
    const validation = caseSchema.safeParse(req.body);

    if (!validation.success) {
      console.error(
        `[createCase] Validation failed: `,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        validation.error.issues
      );
      res.status(400).json({
        type: 'BAD_REQUEST',
        message: '[createCase] Validation failed',
      });
      return;
    }

    try {
      const {
        company,
        individuals,
        metadata,
        email,
        externalId,
        templateId,
      }: {
        company: CompanyInput;
        individuals: IndividualInput[];
        metadata: CaseMetadata;
        email: string;
        externalId: string;
        templateId: string;
      } = req.body;

      let template_id: string | null;

      if (templateId) {
        template_id = templateId;
      } else {
        template_id = templateMapping(company, individuals, metadata);
      }

      const caseName = company
        ? `KYB - ${company.name}`
        : `KYC - ${individuals[0].first_name} ${individuals[0].last_name}`;

      // Set a metadata.email by default
      if (!email && individuals.length > 0) {
        const individualWithEmailIndex = individuals.findIndex(
          (individual: IndividualInput) =>
            individual.roles.includes(IndividualRoleEnum.applicant)
        );

        if (individualWithEmailIndex !== -1) {
          metadata.email = individuals[individualWithEmailIndex].email;
        }
      }

      const createdCase: Case = await this.dotfileApi.request(
        'post',
        'cases',
        {},
        {
          name: caseName,
          ...(externalId && { external_id: externalId }),
          template_id,
          metadata: Object.keys(metadata)
            .filter((k) => metadata[k] != null)
            .reduce((a, k) => ({ ...a, [k]: metadata[k].toString() }), {}),
        },
        {}
      );

      if (individuals.length > 0) {
        for (const individual of individuals) {
          const roles = individual.roles;
          let individualEmail = individual.email;

          // @NOTE If there is no roles, it's a KYC and the default role is "applicant" with a required email
          if (roles.length === 0) {
            roles.push(IndividualRoleEnum.applicant);

            if (email) {
              individualEmail = email;
            }
          }

          await this.dotfileApi.request(
            'post',
            'individuals',
            {},
            {
              // Required
              case_id: createdCase.id,
              roles,
              first_name: individual.first_name,
              last_name: individual.last_name,
              // Optional
              middle_name: individual.middle_name,
              maiden_name: individual.maiden_name,
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
          company.country === 'FR' &&
          company.classifications[0].code
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
            commercial_name: company.commercial_name,
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

  public getCaseByExternalId = async (req: Request, res: Response) => {
    const inputSchema = z.object({
      externalId: z.string(),
    });

    const validation = inputSchema.safeParse(req.params);

    if (!validation.success) {
      console.error(
        `[getCaseByExternalId] Validation failed: `,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        validation.error.issues
      );
      res.status(400).json({
        type: 'BAD_REQUEST',
        message: '[getCaseByExternalId] Validation failed',
      });
      return;
    }

    try {
      const cases: GetCasesResponse = await this.dotfileApi.request(
        'get',
        `cases`,
        { external_id: req.params.externalId },
        {},
        {}
      );

      if (cases.data.length > 0) {
        res.status(200).json({
          caseId: cases.data[0].id,
        });
      } else {
        res.status(200).json({ caseId: null });
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
        console.error('[getCaseByExternalId] Unexpected error: ', error);
        res.status(400).send({
          type: 'error',
          message: '[getCaseByExternalId] An unexpected error occurred',
        });
      }
    }
  };

  public fetchCase = async (req: Request, res: Response) => {
    const inputSchema = z.object({
      id: z.string().uuid(),
    });

    const validation = inputSchema.safeParse(req.params);

    if (!validation.success) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      console.error(`[fetchCase] Validation failed: `, validation.error.issues);
      res.status(400).json({
        type: 'BAD_REQUEST',
        message: '[fetchCase] Validation failed',
      });
      return;
    }

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
          if (check.type !== CheckTypeEnum.aml) {
            if (
              check.status === CheckStatusEnum.rejected ||
              (check.type === CheckTypeEnum.document &&
                check.subtype.includes('custom_document_type'))
            ) {
              const enrichedCheck = await this.dotfileApi.request(
                'get',
                `checks/${check.type}/${check.id}`,
                {},
                {},
                {}
              );

              enrichedChecks.push(enrichedCheck);
            } else {
              enrichedChecks.push(check);
            }
          }
        }
        company.checks = enrichedChecks;
        enrichedCompanies.push(company);
      }

      const enrichedIndividuals = [];
      for (const individual of caseData.individuals) {
        const enrichedChecks = [];
        for (const check of individual.checks) {
          if (check.type !== CheckTypeEnum.aml) {
            if (
              check.status === CheckStatusEnum.rejected ||
              (check.type === CheckTypeEnum.document &&
                check.subtype.includes('custom_document_type')) ||
              (check.type === CheckTypeEnum.id_verification &&
                check.status === CheckStatusEnum.in_progress)
            ) {
              const enrichedCheck = await this.dotfileApi.request(
                'get',
                `checks/${check.type}/${check.id}`,
                {},
                {},
                {}
              );

              enrichedChecks.push(enrichedCheck);
            } else {
              enrichedChecks.push(check);
            }
          }
        }
        individual.checks = enrichedChecks;
        enrichedIndividuals.push(individual);
      }

      caseData.companies = enrichedCompanies;
      caseData.individuals = enrichedIndividuals;

      const caseDetailedDTO = plainToClass(CaseDetailedDTO, caseData, {
        excludeExtraneousValues: true,
      });

      res.status(200).json(caseDetailedDTO);
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

      const checkDTO = plainToClass(CheckDTO, completedChecks, {
        excludeExtraneousValues: true,
      });

      res.status(200).json(checkDTO);
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

      const checkDTO = plainToClass(CheckDTO, completedChecks, {
        excludeExtraneousValues: true,
      });

      res.status(200).json(checkDTO);
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

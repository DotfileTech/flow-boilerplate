import { z } from 'zod';
import { CompanyStatusEnum, IndividualRoleEnum } from '../../constants';

export const caseSchema = z.object({
  company: z
    .object({
      name: z.string(),
      commercial_name: z.string().nullish(),
      registration_number: z.string(),
      registration_date: z.string().nullish(),
      status: z.nativeEnum(CompanyStatusEnum).optional(),
      legal_form: z.string().nullish(),
      country: z.string().length(2),
      address: z
        .object({
          street_address: z.string().nullish(),
          street_address_2: z.string().nullish(),
          postal_code: z.string().nullish(),
          city: z.string().nullish(),
          state: z.string().nullish(),
          region: z.string().nullish(),
          country: z.string().length(2).nullish(),
        })
        .optional(),
      classifications: z
        .object({
          type: z.string().nullish(),
          code: z.string().nullish(),
          description: z.string().nullish(),
        })
        .array()
        .optional(),
      banking_information: z
        .object({
          iban: z.string().min(15).max(34).nullish(),
          bic: z.string().min(8).max(12).nullish(),
        })
        .optional(),
      tax_identification_number: z.string().nullish(),
      website_url: z.string().nullish(),
      employer_identification_number: z.string().nullish(),
    })
    .required({
      name: true,
      registration_number: true,
      country: true,
    }),
  individuals: z
    .object({
      roles: z.nativeEnum(IndividualRoleEnum).optional().array(),
      first_name: z.string(),
      middle_name: z.string().nullish(),
      last_name: z.string(),
      maiden_name: z.string().nullish(),
      email: z.string().email().nullish(),
      birth_date: z.string().nullish(),
      birth_country: z.string().length(2).nullish(),
      birth_place: z.string().nullish(),
      address: z
        .object({
          street_address: z.string().nullish(),
          street_address_2: z.string().nullish(),
          postal_code: z.string().nullish(),
          city: z.string().nullish(),
          state: z.string().nullish(),
          region: z.string().nullish(),
          country: z.string().length(2).nullish(),
        })
        .optional(),
      banking_information: z
        .object({
          iban: z.string().min(15).max(34).nullish(),
          bic: z.string().min(8).max(12).nullish(),
        })
        .optional(),
      tax_identification_number: z.string().nullish(),
      social_security_number: z.string().nullish(),
      phone_number: z
        .string()
        .regex(/^\+(?:[0-9] ?){6,14}[0-9]$/)
        .nullish(),
      position: z.string().nullish(),
      ownership_percentage: z.number().nullish(),
    })
    .required({
      first_name: true,
      last_name: true,
    })
    .array(),
  metadata: z.record(z.string(), z.string().or(z.boolean()).nullish()),
  email: z.string().email().nullish(),
  externalId: z.string().nullish(),
  templateId: z.string().uuid().nullish(),
});

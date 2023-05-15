import * as Yup from 'yup';

import {
  isRequiredField,
  optionalStringRule,
} from '../../helpers/schema.helper';
import { companyData } from '../../config/Company';
import { CompanyStatusEnum } from '../../constants/company-status.enum';

// Mandatory fields to create a company
const mandatoryFields = Yup.object({
  name: Yup.string().required(),
  registration_number: Yup.string().required(),
  country: Yup.string().required(),
});

export const companySchema = mandatoryFields.shape({
  legal_form: isRequiredField(companyData, 'legal_form')
    ? Yup.string().required()
    : optionalStringRule,
  status: isRequiredField(companyData, 'status')
    ? Yup.mixed().oneOf(Object.values(CompanyStatusEnum)).required()
    : Yup.mixed()
        .oneOf(Object.values(CompanyStatusEnum))
        .optional()
        .default(CompanyStatusEnum.not_reported)
        .transform((v) => (v === '' ? CompanyStatusEnum.not_reported : v)),
  registration_date: isRequiredField(companyData, 'registration_date')
    ? Yup.string().required()
    : optionalStringRule,
  address: Yup.object({
    street_address: isRequiredField(companyData, 'street_address')
      ? Yup.string().required()
      : optionalStringRule,
    street_address_2: isRequiredField(companyData, 'street_address_2')
      ? Yup.string().required()
      : optionalStringRule,
    postal_code: isRequiredField(companyData, 'postal_code')
      ? Yup.string().required()
      : optionalStringRule,
    city: isRequiredField(companyData, 'city')
      ? Yup.string().required()
      : optionalStringRule,
    country: isRequiredField(companyData, 'country', 'address')
      ? Yup.string().required()
      : optionalStringRule,
  }),
  banking_information: Yup.object({
    iban: isRequiredField(companyData, 'iban')
      ? Yup.string().min(15).max(34).required()
      : Yup.string()
          .optional()
          .nullable()
          .default(null)
          .min(15)
          .max(34)
          .transform((v) => (v === '' ? null : v)),
    bic: isRequiredField(companyData, 'bic')
      ? Yup.string().min(8).max(12).required()
      : Yup.string()
          .optional()
          .nullable()
          .default(null)
          .min(8)
          .max(12)
          .transform((v) => (v === '' ? null : v)),
  }),
  tax_identification_number: isRequiredField(
    companyData,
    'tax_identification_number'
  )
    ? Yup.string().required()
    : optionalStringRule,
  website_url: isRequiredField(companyData, 'website_url')
    ? Yup.string().url().required()
    : Yup.string().url().optional().nullable().default(null),
  employer_identification_number: isRequiredField(
    companyData,
    'employer_identification_number'
  )
    ? Yup.string().required()
    : optionalStringRule,
  classifications: Yup.array()
    .transform((value, original) => {
      return original;
    })
    .of(
      Yup.object({
        code: isRequiredField(companyData, 'code', 'classifications')
          ? Yup.string().required()
          : optionalStringRule,
      })
    )
    .nullable(),
});

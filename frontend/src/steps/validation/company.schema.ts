import * as Yup from 'yup';

import {
  isRequiredField,
  optionalStringRule,
} from '../../helpers/schema.helper';
import { companyData } from '../../config/Company';
import { CompanyStatusEnum } from '../../constants/company-status.enum';

// Mandatory fields to create a company
const mandatoryFields = Yup.object({
  name: Yup.string().required().label('Name'),
  registration_number: Yup.string().required().label('Registration number'),
  country: Yup.string().required().label('Country'),
});

export const companySchema = mandatoryFields.shape({
  commercial_name: isRequiredField(companyData, 'commercial_name')
    ? Yup.string().required().label('Commercial name')
    : optionalStringRule.label('Commercial name'),
  legal_form: isRequiredField(companyData, 'legal_form')
    ? Yup.string().required().label('Legal form')
    : optionalStringRule.label('Legal form'),
  status: isRequiredField(companyData, 'status')
    ? Yup.mixed()
        .oneOf(Object.values(CompanyStatusEnum))
        .required()
        .label('Status')
    : Yup.mixed()
        .oneOf(Object.values(CompanyStatusEnum))
        .optional()
        .default(CompanyStatusEnum.not_reported)
        .transform((v) => (v === '' ? CompanyStatusEnum.not_reported : v))
        .label('Status'),
  registration_date: isRequiredField(companyData, 'registration_date')
    ? Yup.string().required().label('Registration date')
    : optionalStringRule.label('Registration date'),
  address: Yup.object({
    street_address: isRequiredField(companyData, 'street_address')
      ? Yup.string().required().label('Street address')
      : optionalStringRule.label('Street address'),
    street_address_2: isRequiredField(companyData, 'street_address_2')
      ? Yup.string().required().label('Street address 2')
      : optionalStringRule.label('Street address 2'),
    postal_code: isRequiredField(companyData, 'postal_code')
      ? Yup.string().required().label('Postal code')
      : optionalStringRule.label('Postal code'),
    city: isRequiredField(companyData, 'city')
      ? Yup.string().required().label('City')
      : optionalStringRule.label('City'),
    country: isRequiredField(companyData, 'country', 'address')
      ? Yup.string().required().label('Country')
      : optionalStringRule.label('Country'),
  }),
  banking_information: Yup.object({
    iban: isRequiredField(companyData, 'iban')
      ? Yup.string().min(15).max(34).required().label('IBAN')
      : Yup.string()
          .optional()
          .nullable()
          .default(null)
          .min(15)
          .max(34)
          .transform((v) => (v === '' ? null : v))
          .label('IBAN'),
    bic: isRequiredField(companyData, 'bic')
      ? Yup.string().min(8).max(12).required().label('BIC')
      : Yup.string()
          .optional()
          .nullable()
          .default(null)
          .min(8)
          .max(12)
          .transform((v) => (v === '' ? null : v))
          .label('BIC'),
  }),
  tax_identification_number: isRequiredField(
    companyData,
    'tax_identification_number'
  )
    ? Yup.string().required().label('Tax ID')
    : optionalStringRule.label('Tax ID'),
  website_url: isRequiredField(companyData, 'website_url')
    ? Yup.string().url().required().label('Website')
    : Yup.string().url().optional().nullable().default(null).label('Website'),
  employer_identification_number: isRequiredField(
    companyData,
    'employer_identification_number'
  )
    ? Yup.string().required().label('Employer ID')
    : optionalStringRule.label('Employer ID'),
  classifications: Yup.array()
    .transform((value, original) => {
      return original;
    })
    .of(
      Yup.object({
        code: isRequiredField(companyData, 'code', 'classifications')
          ? Yup.string().required().label('Classification code')
          : optionalStringRule.label('Classification code'),
      })
    )
    .nullable(),
});

import * as Yup from 'yup';

import {
  isRequiredField,
  optionalStringRule,
} from '../../helpers/schema.helper';
import { individualData } from '../../config/Individual';
import { IndividualRoleEnum } from '../../constants';

// Mandatory fields to create an individual
const mandatoryFields = Yup.object({
  first_name: Yup.string().required(),
  last_name: Yup.string().required(),
});

export const individualSchema = mandatoryFields.shape({
  email: isRequiredField(individualData, 'email')
    ? Yup.string()
        .email()
        .transform((v) => (v === '' ? null : v))
        .required()
    : optionalStringRule.email(),
  roles: Yup.array(Yup.mixed().oneOf(Object.values(IndividualRoleEnum)))
    .min(1)
    .required(),
  birth_date: isRequiredField(individualData, 'birth_date')
    ? Yup.string().required()
    : optionalStringRule,
  birth_country: isRequiredField(individualData, 'birth_country')
    ? Yup.string().required()
    : optionalStringRule,
  birth_place: isRequiredField(individualData, 'birth_place')
    ? Yup.string().required()
    : optionalStringRule,
  address: Yup.object({
    street_address: isRequiredField(individualData, 'street_address')
      ? Yup.string().required()
      : optionalStringRule,
    street_address_2: isRequiredField(individualData, 'street_address_2')
      ? Yup.string().required()
      : optionalStringRule,
    postal_code: isRequiredField(individualData, 'postal_code')
      ? Yup.string().required()
      : optionalStringRule,
    city: isRequiredField(individualData, 'city')
      ? Yup.string().required()
      : optionalStringRule,
    country: isRequiredField(individualData, 'country', 'address')
      ? Yup.string().required()
      : optionalStringRule,
  }),
  banking_information: Yup.object({
    iban: isRequiredField(individualData, 'iban')
      ? Yup.string().min(15).max(34).required()
      : Yup.string()
          .optional()
          .nullable()
          .default(null)
          .min(15)
          .max(34)
          .transform((v) => (v === '' ? null : v)),
    bic: isRequiredField(individualData, 'bic')
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
    individualData,
    'tax_identification_number'
  )
    ? Yup.string().required()
    : optionalStringRule,
  social_security_number: isRequiredField(
    individualData,
    'social_security_number'
  )
    ? Yup.string().required()
    : optionalStringRule,
  phone_number: isRequiredField(individualData, 'phone_number')
    ? Yup.string()
        .matches(/^\+(?:[0-9] ?){6,14}[0-9]$/)
        .required()
    : optionalStringRule.matches(/^\+(?:[0-9] ?){6,14}[0-9]$/),
  position: isRequiredField(individualData, 'position')
    ? Yup.string().required()
    : optionalStringRule,
  ownership_percentage: isRequiredField(individualData, 'ownership_percentage')
    ? Yup.number().min(0).max(100).required()
    : Yup.number().min(0).max(100).optional().nullable().default(null),
});

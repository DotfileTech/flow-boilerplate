import * as Yup from 'yup';

import {
  isEnabledField,
  isRequiredField,
  optionalStringRule,
} from '../../helpers/schema.helper';
import { individualData } from '../../config/Individual';
import { IndividualRoleEnum } from '../../constants';

// Mandatory fields to create an individual
const mandatoryFields = Yup.object({
  first_name: Yup.string().required().label('First name'),
  last_name: Yup.string().required().label('Last name'),
});

export const individualSchema = mandatoryFields.shape({
  middle_name: isRequiredField(individualData, 'middle_name')
    ? Yup.string().required().label('Middle name')
    : optionalStringRule.label('Middle name'),
  maiden_name: isRequiredField(individualData, 'maiden_name')
    ? Yup.string().required().label('Maiden name')
    : optionalStringRule.label('Maiden name'),
  email: isRequiredField(individualData, 'email')
    ? Yup.string()
        .email()
        .transform((v) => (v === '' ? null : v))
        .required()
        .label('Email')
    : Yup.string()
        .email()
        .when('roles', {
          is: (roles: IndividualRoleEnum[]) =>
            roles && roles.includes(IndividualRoleEnum.applicant),
          then: (schema) =>
            schema
              .transform((v) => (v === '' ? null : v))
              .required()
              .label('Email'),
          otherwise: (schema) =>
            schema
              .optional()
              .nullable()
              .default(null)
              .transform((v) => (v === '' ? null : v))
              .label('Email'),
        }),
  roles: isEnabledField(individualData, 'roles')
    ? Yup.array(Yup.mixed().oneOf(Object.values(IndividualRoleEnum)))
        .min(1)
        .required()
        .label('Roles')
    : Yup.array(Yup.mixed().oneOf(Object.values(IndividualRoleEnum))).label(
        'Roles'
      ),
  birth_date: isRequiredField(individualData, 'birth_date')
    ? Yup.string().required().label('Birth date')
    : optionalStringRule.label('Birth date'),
  birth_country: isRequiredField(individualData, 'birth_country')
    ? Yup.string().required().label('Birth country')
    : optionalStringRule.label('Birth country'),
  birth_place: isRequiredField(individualData, 'birth_place')
    ? Yup.string().required().label('Birth place')
    : optionalStringRule.label('Birth place'),
  address: Yup.object({
    street_address: isRequiredField(individualData, 'street_address')
      ? Yup.string().required().label('Street address')
      : optionalStringRule.label('Street address'),
    street_address_2: isRequiredField(individualData, 'street_address_2')
      ? Yup.string().required().label('Street address 2')
      : optionalStringRule.label('Street address 2'),
    postal_code: isRequiredField(individualData, 'postal_code')
      ? Yup.string().required().label('Postal code')
      : optionalStringRule.label('Postal code'),
    city: isRequiredField(individualData, 'city')
      ? Yup.string().required().label('City')
      : optionalStringRule.label('City'),
    country: isRequiredField(individualData, 'country', 'address')
      ? Yup.string().required().label('Country')
      : optionalStringRule.label('Country'),
  }),
  banking_information: Yup.object({
    iban: isRequiredField(individualData, 'iban')
      ? Yup.string().min(15).max(34).required().label('IBAN')
      : Yup.string()
          .optional()
          .nullable()
          .default(null)
          .min(15)
          .max(34)
          .transform((v) => (v === '' ? null : v))
          .label('IBAN'),
    bic: isRequiredField(individualData, 'bic')
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
    individualData,
    'tax_identification_number'
  )
    ? Yup.string().required().label('Tax ID')
    : optionalStringRule.label('Tax ID'),
  social_security_number: isRequiredField(
    individualData,
    'social_security_number'
  )
    ? Yup.string().required().label('Social security number')
    : optionalStringRule.label('Social security number'),
  phone_number: isRequiredField(individualData, 'phone_number')
    ? Yup.string()
        .matches(
          /^\+(?:[0-9] ?){6,14}[0-9]$/,
          'Phone number should follow international standard format'
        )
        .required()
    : optionalStringRule.matches(
        /^\+(?:[0-9] ?){6,14}[0-9]$/,
        'Phone number should follow international standard format'
      ),
  position: isRequiredField(individualData, 'position')
    ? Yup.string().required().label('Position')
    : optionalStringRule.label('Position'),
  ownership_percentage: isRequiredField(individualData, 'ownership_percentage')
    ? Yup.number()
        .min(0)
        .max(100)
        .transform((value) => (isNaN(value) || value === '' ? null : value))
        .required()
        .label('Ownership percentage')
    : Yup.number()
        .min(0)
        .max(100)
        .transform((value) => (isNaN(value) || value === '' ? null : value))
        .optional()
        .nullable()
        .default(null)
        .label('Ownership percentage'),
});

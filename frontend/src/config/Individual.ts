import { IndividualRoleEnum } from '../constants';
import { IndividualData } from '../types';

export const individualData: IndividualData[] = [
  {
    // This field is mandatory to create an individual
    id: 'first_name',
    required: true,
    enabled: true,
  },
  {
    id: 'middle_name',
    required: false,
    enabled: true,
  },
  {
    // This field is mandatory to create an individual
    id: 'last_name',
    required: true,
    enabled: true,
  },
  {
    id: 'maiden_name',
    required: false,
    enabled: true,
  },
  {
    // This field is mandatory to create an individual with the "applicant" role
    id: 'email',
    type: 'email',
    required: false,
    enabled: false,
  },
  {
    // This field is mandatory to create an individual in a KYB
    id: 'roles',
    type: 'checkbox',
    required: false,
    enabled: false,
    options: [
      IndividualRoleEnum.beneficial_owner,
      IndividualRoleEnum.legal_representative,
      IndividualRoleEnum.shareholder,
    ],
  },
  {
    id: 'ownership_percentage',
    type: 'number',
    required: false,
    enabled: false,
  },
  {
    id: 'position',
    required: false,
    enabled: false,
  },
  {
    id: 'tax_identification_number',
    required: false,
    enabled: false,
  },
  {
    id: 'social_security_number',
    required: false,
    enabled: false,
  },
  {
    id: 'birth_date',
    type: 'date',
    required: true,
    enabled: true,
  },
  {
    id: 'birth_place',
    required: true,
    enabled: true,
  },
  {
    id: 'birth_country',
    type: 'country',
    required: true,
    enabled: true,
  },
  {
    id: 'phone_number',
    type: 'tel',
    required: true,
    hasHelper: true,
    enabled: true,
  },
  {
    id: 'street_address',
    nested: 'address',
    required: true,
    enabled: true,
  },
  {
    id: 'street_address_2',
    nested: 'address',
    required: false,
    enabled: false,
  },
  {
    id: 'postal_code',
    nested: 'address',
    required: true,
    enabled: true,
  },
  {
    id: 'city',
    nested: 'address',
    required: true,
    enabled: true,
  },
  {
    id: 'country',
    nested: 'address',
    type: 'country',
    required: true,
    enabled: true,
  },
  {
    id: 'iban',
    nested: 'banking_information',
    required: false,
    enabled: false,
  },
  {
    id: 'bic',
    nested: 'banking_information',
    required: false,
    enabled: false,
  },
];

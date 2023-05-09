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
    // This field is mandatory to create an individual
    id: 'last_name',
    required: true,
    enabled: true,
  },
  {
    // This field is mandatory to create an individual with the "applicant" role
    id: 'email',
    type: 'email',
    required: false,
    enabled: true,
  },
  {
    id: 'phone_number',
    type: 'tel',
    required: false,
    enabled: true,
  },
  {
    // This field is mandatory to create an individual
    id: 'roles',
    type: 'checkbox',
    required: true,
    enabled: true,
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
    enabled: true,
  },
  {
    id: 'position',
    required: false,
    enabled: true,
  },
  {
    id: 'tax_identification_number',
    required: false,
    enabled: true,
  },
  {
    id: 'social_security_number',
    required: false,
    enabled: true,
  },
  {
    id: 'iban',
    nested: 'banking_information',
    required: false,
    enabled: true,
  },
  {
    id: 'bic',
    nested: 'banking_information',
    required: false,
    enabled: true,
  },
  {
    id: 'birth_date',
    type: 'date',
    required: false,
    enabled: true,
  },
  {
    id: 'birth_place',
    required: false,
    enabled: true,
  },
  {
    id: 'birth_country',
    type: 'country',
    required: false,
    enabled: true,
  },
  {
    id: 'street_address',
    nested: 'address',
    required: false,
    enabled: true,
  },
  {
    id: 'street_address_2',
    nested: 'address',
    required: false,
    enabled: true,
  },
  {
    id: 'postal_code',
    nested: 'address',
    required: false,
    enabled: true,
  },
  {
    id: 'city',
    nested: 'address',
    required: false,
    enabled: true,
  },
  {
    id: 'country',
    nested: 'address',
    type: 'country',
    required: false,
    enabled: true,
  },
];

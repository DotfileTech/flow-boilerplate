import { CompanyStatusEnum } from '../constants/company-status.enum';

export const companyData = [
  {
    id: 'name',
    required: true,
    enabled: true,
  },
  {
    id: 'registration_number',
    required: true,
    enabled: true,
  },
  {
    id: 'legal_form',
    required: false,
    enabled: true,
  },
  {
    id: 'status',
    type: 'select',
    required: false,
    enabled: true,
    options: [
      CompanyStatusEnum.live,
      CompanyStatusEnum.closed,
      CompanyStatusEnum.registered,
    ],
  },
  {
    id: 'registration_date',
    type: 'date',
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
    required: true,
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
    id: 'tax_identification_number',
    required: false,
    enabled: true,
  },
  {
    id: 'website_url',
    type: 'url',
    required: false,
    enabled: true,
  },
  {
    id: 'employer_identification_number',
    required: false,
    enabled: true,
  },
];

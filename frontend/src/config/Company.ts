import { CompanyStatusEnum } from '../constants/company-status.enum';
import { CompanyData } from '../types';

export const companyData: CompanyData[] = [
  {
    // This field is mandatory to create a company
    id: 'country',
    type: 'country',
    required: true,
    enabled: true,
  },
  {
    // This field is mandatory to create a company
    id: 'name',
    required: true,
    enabled: true,
  },
  {
    id: 'commercial_name',
    required: false,
    enabled: false,
  },
  {
    // This field is mandatory to create a company
    id: 'registration_number',
    required: true,
    enabled: true,
  },
  {
    id: 'legal_form',
    required: true,
    enabled: true,
  },
  {
    id: 'status',
    type: 'select',
    required: false,
    enabled: false,
    options: [
      CompanyStatusEnum.live,
      CompanyStatusEnum.closed,
      CompanyStatusEnum.not_reported,
    ],
  },
  {
    id: 'registration_date',
    type: 'date',
    required: false,
    enabled: false,
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
  {
    id: 'code',
    nested: 'classifications',
    required: false,
    enabled: true,
  },
  {
    id: 'description',
    nested: 'classifications',
    required: false,
    enabled: true,
  },
  {
    id: 'street_address',
    nested: 'address',
    required: false,
    enabled: false,
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
    required: false,
    enabled: false,
  },
  {
    id: 'city',
    nested: 'address',
    required: false,
    enabled: false,
  },
  {
    id: 'country',
    nested: 'address',
    type: 'country',
    required: false,
    enabled: false,
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

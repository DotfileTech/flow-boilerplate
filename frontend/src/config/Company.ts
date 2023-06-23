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
    id: 'registration_date',
    type: 'date',
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
    id: 'tax_identification_number',
    required: false,
    enabled: false,
  },
  {
    id: 'website_url',
    type: 'url',
    required: true,
    enabled: true,
  },
  {
    id: 'employer_identification_number',
    required: false,
    enabled: false,
  },
  {
    id: 'code',
    nested: 'classifications',
    required: true,
    enabled: true,
  },
  {
    id: 'description',
    nested: 'classifications',
    required: true,
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
    enabled: true,
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
    required: true,
    enabled: true,
  },
  {
    id: 'bic',
    nested: 'banking_information',
    required: true,
    enabled: true,
  },
];

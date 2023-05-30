import { CompanyStatusEnum } from '../constants/company-status.enum';
import { CompanyData } from '../types';

export const companyData: CompanyData[] = [
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
    required: false,
    enabled: false,
  },
  {
    // This field is mandatory to create a company
    id: 'country',
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
<<<<<<< HEAD
    enabled: true,
=======
    enabled: false,
  },
  {
    id: 'website_url',
    type: 'url',
    required: false,
    enabled: false,
  },
  {
    id: 'employer_identification_number',
    required: false,
    enabled: false,
  },
  {
    id: 'code',
    nested: 'classifications',
    required: false,
    enabled: false,
>>>>>>> 1dcf1b3 (🔀 Rebase main with new features)
  },
];

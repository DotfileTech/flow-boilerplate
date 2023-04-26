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
    // Format validation ISO 13616 IBAN (eg: IE12BOFI90000112345678)
    id: 'iban',
    nested: 'banking_information',
    required: false,
    enabled: true,
  },
  {
    // Format validation ISO 9362 BIC (eg: DEUTDEFF)
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
    // Format validation
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

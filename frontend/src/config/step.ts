import { CustomField } from '../types';

// @deprecated
// To apply a specific design on the Checks list and card
export const hasKyb = true;

export const stepsConfig: {
  key: string;
  fields?: CustomField[];
  // Only for individuals_list step
  hasApplicant?: boolean;
  // Only for pdf_viewer step
  pdfUrl?: string;
}[] = [
  {
    key: 'disclaimer',
  },
  {
    key: 'company_search',
  },
  {
    key: 'company_list',
  },
  {
    key: 'company_edit',
  },
  {
    key: 'nilos_account',
    fields: [
      {
        id: 'company_website',
        isRequired: true,
        hasHelper: true,
      },
      {
        id: 'company_operational_address',
        type: 'text',
        isRequired: false,
        hasHelper: true,
      },
      {
        id: 'company_activity',
        type: 'select',
        isRequired: true,
        hasHelper: true,
        options: [
          'Cryptocurrencies and cryptoassets',
          'Agriculture, forestry, and fishing',
          'Mining and quarrying',
          'Manufacturing',
          'Electricity, gas, steam, and air conditioning supply',
          'Water supply, sewerage, waste management, and remediation activities',
          'Construction',
          'Wholesale and retail trade; repair of motor vehicles and motorcycles',
          'Transportation and storage',
          'Accommodation and food service activities',
          'Information and communication',
          'Financial and insurance activities',
          'Real estate activities',
          'Professional, scientific, and technical activities',
          'Administrative and support service activities',
          'Public administration and defense; compulsory social security',
          'Education',
          'Human health and social work activities',
          'Arts, entertainment, and recreation',
          'Other service activities',
          'Activities of households as employers; undifferentiated goods- and services-producing activities of households for own use',
          'Activities of extraterritorial organizations and bodies',
        ],
      },
      {
        id: 'last_year_turnover',
        type: 'number',
        isRequired: true,
        hasHelper: true,
      },
      {
        id: 'company_assets',
        type: 'number',
        isRequired: true,
        hasHelper: true,
      },
      {
        id: 'source_of_funds',
        isRequired: true,
        hasHelper: true,
      },
      {
        id: 'estimate_deposit_monthly',
        type: 'number',
        isRequired: true,
        hasHelper: true,
      },
      {
        id: 'monthly_fiat_transactions',
        type: 'number',
        isRequired: true,
        hasHelper: true,
      },
      {
        id: 'phone',
        type: 'tel',
        isRequired: true,
      },
      {
        id: 'are_you_a_pep',
        type: 'radio',
        isRequired: true,
        hasHelper: true,
        options: ['yes', 'no'],
      },
      {
        id: 'are_you_a_us_person',
        type: 'radio',
        isRequired: true,
        hasHelper: true,
        options: ['yes', 'no'],
      },
    ],
  },
  {
    key: 'individuals_list',
    hasApplicant: true,
  },
  {
    key: 'pdf_viewer_terms',
    pdfUrl: 'https://acme.onboarding.dotfile.com/terms-and-conditions.pdf',
  },
];

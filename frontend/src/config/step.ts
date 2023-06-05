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
        type: 'url',
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
        type: 'text',
        isRequired: true,
        hasHelper: true,
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
        isRequired: true,
      },
      {
        id: 'estimate_frequency_fiat_payouts',
        isRequired: true,
      },
      {
        id: 'phone',
        type: 'text',
        isRequired: true,
      },
      {
        id: 'personal_address',
        type: 'text',
        isRequired: true,
        hasHelper: true,
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

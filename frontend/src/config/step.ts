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
    key: 'company_search',
  },
  {
    key: 'company_list',
  },
  {
    key: 'company_edit',
  },
  {
    key: 'about_your_company',
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
    key: 'payment_details',
    fields: [
      {
        id: 'what_should_we_do_with_the_funds_you_receive_on_nilos',
        type: 'select',
        isRequired: true,
        hasHelper: true,
        options: [
          'Any crypto received on my Nilos account has to be automatically exchanged into FIAT and transferred to the bank account below',
          'Any crypto received on my Nilos account has to be automatically transferred to an external wallet I will communicate to Nilos',
        ],
      },
      {
        id: 'iban_account_number',
        type: 'text',
        isRequired: false,
        hasHelper: true,
      },
      {
        id: 'bic_swift',
        type: 'text',
        isRequired: false,
      },
      {
        id: 'your_currency',
        type: 'select',
        isRequired: false,
        hasHelper: true,
        options: ['EUR', 'USD', 'GBP', 'CHF'],
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

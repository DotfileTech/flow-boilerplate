import { CustomField } from '../types';

// @deprecated
// To apply a specific design on the Checks list and card
export const hasKyb = false;

export const stepsConfig: {
  key: string;
  fields?: CustomField[];
  // Only for individuals_list step
  hasApplicant?: boolean;
  // Only for pdf_viewer step
  pdfUrl?: string;
}[] = [
  {
    key: 'individual_edit',
  },
  {
    key: 'about_you',
    fields: [
      {
        id: 'Your company',
        isRequired: false,
        hasHelper: true,
      },
      {
        id: 'Personal assets',
        type: 'number',
        isRequired: true,
        hasHelper: true,
      },
      {
        id: 'Personal income',
        type: 'number',
        isRequired: true,
        hasHelper: true,
      },
      {
        id: 'Are you considered as a PEP?',
        type: 'radio',
        isRequired: true,
        hasHelper: true,
        options: ['yes', 'no'],
      },
      {
        id: 'Are you, or any beneficial owner of the company, a US Person?',
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
        id: 'What should we do with the funds you receive on Nilos?',
        type: 'select',
        isRequired: true,
        hasHelper: true,
        options: [
          'Any crypto received with Nilos has to be automatically exchanged into FIAT and transferred to the bank account below',
          'Any crypto received with Nilos has to be automatically transferred to an external wallet I will communicate to Nilos',
        ],
      },
      {
        id: 'IBAN / Account number',
        isRequired: true,
        hasHelper: true,
      },
      {
        id: 'BIC / SWIFT',
        isRequired: true,
      },
      {
        id: 'Currency',
        type: 'select',
        isRequired: true,
        hasHelper: true,
        options: ['EUR', 'GBP', 'CHF', 'USD'],
      },
    ],
  },
  {
    key: 'pdf_viewer_terms',
    pdfUrl: 'https://nilos-kyc.onboarding.dotfile.com/terms-and-conditions.pdf',
  },
];

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
        id: 'company',
        isRequired: false,
        hasHelper: true,
      },
      {
        id: 'asset',
        type: 'number',
        isRequired: true,
        hasHelper: true,
      },
      {
        id: 'income',
        type: 'number',
        isRequired: true,
        hasHelper: true,
      },
      {
        id: 'pep',
        type: 'radio',
        isRequired: true,
        hasHelper: true,
        options: ['yes', 'no'],
      },
      {
        id: 'us_person',
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
        id: 'funds',
        type: 'select',
        isRequired: true,
        hasHelper: true,
        options: ['Any crypto received with Nilos has to be automatically exchanged into FIAT and transferred to the bank account below','Any crypto received with Nilos has to be automatically transferred to an external wallet I will communicate to Nilos'],
      },
      {
        id: 'iban',
        isRequired: true,
        hasHelper: true,
      },
      {
        id: 'bic',
        isRequired: true,
      },
      {
        id: 'currency',
        type: 'select',
        isRequired: true,
        hasHelper: true,
        options: ['EUR','GBP','CHF','USD'],
      },
    ],
  },
  {
    key: 'pdf_viewer_terms',
    pdfUrl: 'https://acme.onboarding.dotfile.com/terms-and-conditions.pdf',
  },
];

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
    key: 'company_custom',
    fields: [
      {
        id: 'activity',
        isRequired: true,
        type: 'select',
        options: [
          'Artisan',
          'Association',
          'EI',
          'EURL',
          'SARL',
          'SAS',
          'SASU',
        ],
      },
      {
        id: 'cb_mensuel',
        isRequired: true,
        hasHelper: true,
        type: 'number',
      },
      {
        id: 'Adresse de livraison',
        isRequired: true,
        hasHelper: false,
        type: 'text',
      },
      {
        id: 'Complément d\'adresse',
        isRequired: false,
        hasHelper: false,
        type: 'text',
      },
      {
        id: 'Code Postal',
        isRequired: true,
        hasHelper: false,
        type: 'text',
      },
      {
        id: 'Ville',
        isRequired: true,
        hasHelper: false,
        type: 'text',
      },
      {
        id: 'Pays',
        isRequired: true,
        hasHelper: false,
        type: 'text',
      }
    ],
  },
  {
    key: 'individuals_list',
    hasApplicant: true,
  },
  {
    key: 'pdf_viewer_cgv',
    pdfUrl: 'https://yavin.onboarding.dotfile.com/cgv-yavin.pdf'
  },
  {
    key: 'pdf_viewer_cgu_app',
    pdfUrl: 'https://yavin.onboarding.dotfile.com/cgu-app-yavin.pdf'
  },
  {
    key: 'pdf_viewer_cgu_monetique',
    pdfUrl: 'https://yavin.onboarding.dotfile.com/terms-and-conditions.pdf',
  },
];

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
    key: 'who_are_you',
    fields: [
      {
        id: 'Qui êtes-vous ?',
        isRequired: true,
        type: 'radio',
        options: [
          'Une société',
          'Une entreprise individuelle',
          'Un particulier',
        ],
      },
    ],
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
    key: 'activity_abroad',
    fields: [
      {
        id: 'Confirmez que',
        isRequired: false,
        type: 'checkbox',
        options: [
          "La société n'est pas une US person",
          "La société n'est pas une entité exemptée",
          "La société n'est pas une ENF passive",
        ],
      },
      {
        id: "Avez vous une résidence fiscale dans d'autres pays ?",
        isRequired: false,
        type: 'radio',
        options: ['yes', 'no'],
      },
      {
        id: 'Si oui, veuillez lister les pays de votre résidence fiscale',
        isRequired: false,
      },
      {
        id: 'Pour vos autres résidences fiscales, renseignez les NIF',
        isRequired: false,
      },
    ],
  },
  {
    key: 'pdf_viewer_countries_risked',
    pdfUrl: 'https://getpanto.onboarding.dotfile.com/terms-and-conditions.pdf',
  },
  {
    key: 'individuals_list',
    hasApplicant: false,
  },
  {
    key: 'pdf_viewer_terms',
    pdfUrl: 'https://getpanto.onboarding.dotfile.com/terms-and-conditions.pdf',
  },
];

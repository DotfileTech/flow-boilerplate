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
    key: 'disclaimer',
    fields: [],
  },
  {
    key: 'individual_edit',
  },
  {
    key: 'personal_details',
    fields: [
      {
        id: 'us_tax_payer_status',
        type: 'radio',
        isRequired: true,
        options: ['yes', 'no'],
      },
      {
        id: 'are_you_a_pep',
        type: 'radio',
        isRequired: true,
        options: ['yes', 'no'],
      },
    ],
  },
  {
    key: 'origin_funds',
    fields: [
      {
        id: 'origin_funds',
        type: 'select',
        isRequired: true,
        options: [
          'professional_income',
          'holding_revenue',
          'sale_of_securities',
          'sales_of_property',
          'inheritance_donation',
          'other_source',
        ],
      },
    ],
  },
];

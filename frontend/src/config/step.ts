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
    fields: [],
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
    key: 'company_details',
    fields: [
      {
        id: 'trade_registry_location',
        isRequired: true,
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
        options: ['company_revenue', 'shareholder_contribution'],
      },
    ],
  },
  {
    key: 'individuals_list',
    hasApplicant: false,
  },
];

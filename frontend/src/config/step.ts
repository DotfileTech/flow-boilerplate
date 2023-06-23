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
    key: 'individuals_list',
    hasApplicant: true,
  },
];

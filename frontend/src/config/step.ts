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
  // Enable the individual_edit step only for a KYC
  /*{
    key: 'individual_edit',
  },*/
  // A step with a pdf viewer and a checkbox (like T&Cs) must contain "pdf_viewer" in the key (eg: pdf_viewer_terms)
  {
    key: 'pdf_viewer_terms',
    pdfUrl: 'https://acme.onboarding.dotfile.com/terms-and-conditions.pdf',
  },
];

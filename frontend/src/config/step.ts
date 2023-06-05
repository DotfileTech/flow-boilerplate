import { CustomField } from '../types';

// @deprecated
// To apply a specific design on the Checks list and card
export const hasKyb = true;

export const stepsConfig: {
  key: string;
  fields?: CustomField[];
  hasApplicant?: boolean;
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
  {
    key: 'terms_and_conditions',
  },
];

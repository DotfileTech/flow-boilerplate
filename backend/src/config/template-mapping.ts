import { CaseMetadata, CompanyInput, IndividualInput } from '../types';

// Custom template mapping
// Write the logic to return the good template
export const templateMapping = (
  company: CompanyInput,
  individuals: IndividualInput[],
  metadata: CaseMetadata
): string => {
  if (metadata['self_employed'] === 'yes') {
    if (company.country === 'FR') {
      return process.env.TEMPLATE_SELF_EMPLOYED_FR;
    } else {
      return process.env.TEMPLATE_SELF_EMPLOYED;
    }
  }
  if (metadata['self_employed'] === 'no') {
    if (company.country === 'FR') {
      return process.env.TEMPLATE_MERCHANT_FR;
    } else {
      return process.env.TEMPLATE_MERCHANT;
    }
  }

  return process.env.TEMPLATE_ID;
};

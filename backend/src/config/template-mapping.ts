import { CaseMetadata, CompanyInput, IndividualInput } from '../types';

// Custom template mapping
// Write the logic to return the good template
export const templateMapping = (
  company: CompanyInput,
  individuals: IndividualInput[],
  metadata: CaseMetadata
): string => {
  if (metadata['are_you'].includes('an_exchange_platform')) {
    return process.env.TEMPLATE_EXCHANGES;
  } else {
    return process.env.TEMPLATE_ID; // Token Issuer
  }
};

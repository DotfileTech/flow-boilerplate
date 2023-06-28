import { CaseMetadata, CompanyInput, IndividualInput } from '../types';
// Custom template mapping
// Write the logic to return the good template
export const templateMapping = (
  company: CompanyInput,
  individuals: IndividualInput[],
  metadata: CaseMetadata
): string => {
  let template_id = process.env.TEMPLATE_PRIVATE_COMPANY;

  if (company.country === 'FR') {
    if (metadata['activity'] === 'Association') {
      // Association
      template_id = process.env.TEMPLATE_ASSOCIATION;
    }
    if (metadata['activity'] === 'Artisan' || metadata['activity'] === 'EI') {
      // Artisan ou Entrepreneur Individuel
      template_id = process.env.TEMPLATE_EI;
    }
  }
  else {
    // EURL ou SARL ou SAS ou SASU
    template_id = process.env.TEMPLATE_PRIVATE_COMPANY;
  }
      
    return template_id;
  };

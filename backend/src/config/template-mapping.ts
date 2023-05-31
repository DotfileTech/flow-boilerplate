import { CaseMetadata, CompanyInput, IndividualInput } from '../types';

// Custom template mapping
// Write the logic to return the good template
export const templateMapping = (
  company: CompanyInput,
  individuals: IndividualInput[],
  metadata: CaseMetadata
): string => {
  let template_id = process.env.TEMPLATE_ID;

  if (company.country === 'FR') {
    if (metadata['company_form'] === 'private_company') {
      // Entreprise non cotée
      template_id = process.env.TEMPLATE_PRIVATE_COMPANY;
    }
    if (metadata['company_form'] === 'public_company') {
      // Entreprise cotée
      template_id = process.env.TEMPLATE_PUBLIC_COMPANY;
    }
    if (metadata['company_form'] === 'association') {
      // Association
      template_id = process.env.TEMPLATE_ASSOCIATION;
    }
    if (metadata['company_form'] === 'self_employed') {
      // Indépendant / Profession Libérale
      template_id = process.env.TEMPLATE_SELF_EMPLOYED;
    }
  } else {
    if (metadata['company_form'] === 'association') {
      // INT - Association
      template_id = process.env.TEMPLATE_INT_ASSOCIATION;
    }

    // INT - Entreprise
    template_id = process.env.TEMPLATE_INT_ENTREPRISE;
  }

  return template_id;
};

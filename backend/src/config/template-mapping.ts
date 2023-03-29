import { CaseMetadata, CompanyInput, IndividualInput } from '../types';

// Custom template mapping
// Write the logic to return the good template
export const templateMapping = (
  company: CompanyInput,
  individuals: IndividualInput[],
  metadata: CaseMetadata
): string => {
  let template_id = process.env.TEMPLATE_ID;

  switch (metadata['company_structure']) {
    case 'private_company':
      template_id = process.env.TEMPLATE_PRIVATE_COMPANY;
      break;
    case 'public_company':
      template_id = process.env.TEMPLATE_PUBLIC_COMPANY;
      break;
    case 'association':
      template_id = process.env.TEMPLATE_ASSOCIATION;
      break;
    case 'self_employed':
      template_id = process.env.TEMPLATE_SELF_EMPLOYED;
      break;
    default:
      template_id = process.env.TEMPLATE_ID;
  }

  return template_id;
};

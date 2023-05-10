import { CaseMetadata, CompanyInput, IndividualInput } from '../types';

// Custom template mapping
// Write the logic to return the good template
export const templateMapping = (
  company: CompanyInput,
  individuals: IndividualInput[],
  metadata: CaseMetadata
): string => {
  let template_id = process.env.TEMPLATE_ID;

  switch (metadata['origin_funds']) {
    case 'company_revenue':
      template_id = process.env.TEMPLATE_COMPANY_REVENUE;
      break;
    case 'shareholder_contribution':
      template_id = process.env.TEMPLATE_SHAREHOLDER_CONTRIBUTION;
      break;
    default:
      template_id = process.env.TEMPLATE_COMPANY_REVENUE;
  }

  return template_id;
};

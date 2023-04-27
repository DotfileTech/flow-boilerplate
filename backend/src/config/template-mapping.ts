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
    case 'professional_income':
      template_id = process.env.TEMPLATE_PROFESSIONAL_INCOME;
      break;
    case 'holding_revenue':
      template_id = process.env.TEMPLATE_HOLDING_REVENUE;
      break;
    case 'sale_of_securities':
      template_id = process.env.TEMPLATE_SALE_OF_SECURITIES;
      break;
    case 'sales_of_property':
      template_id = process.env.TEMPLATE_SALES_OF_PROPERTY;
      break;
    case 'inheritance_donation':
      template_id = process.env.TEMPLATE_INHERITANCE_DONATION;
      break;
    case 'other_source':
      template_id = process.env.TEMPLATE_OTHER_SOURCE;
      break;
    default:
      template_id = process.env.TEMPLATE_ID;
  }

  return template_id;
};
